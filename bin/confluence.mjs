import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import { marked } from "marked";
import { loadDocs } from "../tools/arc42-site/loadDocs.mjs";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export async function runConfluenceSync(options) {
  if (!options.baseUrl) throw new Error("--base-url is required");
  if (!options.pageId) throw new Error("--page-id is required");
  const emailEnv = options.emailEnv ?? "CONFLUENCE_EMAIL";
  const tokenEnv = options.tokenEnv ?? "CONFLUENCE_API_TOKEN";
  const email = process.env[emailEnv];
  const token = process.env[tokenEnv];
  if (!email || !token)
    throw new Error(
      `set both ${emailEnv} and ${tokenEnv} environment variables before connecting`,
    );

  const baseUrl = parseBaseUrl(options.baseUrl);
  const docsDir = join(process.cwd(), options.docs ?? "docs/architecture");
  const docs = await loadDocs(docsDir);
  const html = await renderPage(docs);
  const targetDigest = digest(html);
  const manifestPath = join(
    process.cwd(),
    ".arcshape",
    "confluence-sync",
    `${safePageId(options.pageId)}.json`,
  );
  const previous = await readManifest(manifestPath);
  const auth = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  const endpoint = new URL(
    `${baseUrl.pathname.replace(/\/$/, "")}/api/v2/pages/${encodeURIComponent(options.pageId)}`,
    baseUrl.origin,
  );
  endpoint.searchParams.set("body-format", "storage");

  const page = await getPage(endpoint, auth);
  if (
    !page ||
    String(page.id) !== String(options.pageId) ||
    !page.title ||
    !Number.isInteger(page.version?.number)
  )
    throw new Error("Confluence returned an incomplete page response");
  const currentHtml = page.body?.storage?.value ?? "";
  const currentDigest = digest(currentHtml);

  if (currentDigest === targetDigest) {
    if (!options.dryRun)
      await writeManifest(manifestPath, {
        pageId: String(page.id),
        digest: targetDigest,
      });
    printResult({
      action: options.dryRun ? "dry-run-unchanged" : "unchanged",
      pageId: String(page.id),
      title: page.title,
      baseUrl: baseUrl.origin,
      sections: docs.sections.length,
    });
    return { exitCode: 0 };
  }

  if (previous && previous.digest !== currentDigest) {
    printResult({
      action: "conflict",
      pageId: String(page.id),
      title: page.title,
      reason:
        "the Confluence page changed since ArcShape last synchronized it; review the remote edits before syncing",
    });
    return { exitCode: 1 };
  }
  if (!previous && !isBlankHtml(currentHtml)) {
    printResult({
      action: "conflict",
      pageId: String(page.id),
      title: page.title,
      reason:
        "the selected page already has content and is not managed by ArcShape; select a blank page to initialize synchronization",
    });
    return { exitCode: 1 };
  }

  if (options.dryRun) {
    printResult({
      action: "dry-run-update",
      pageId: String(page.id),
      title: page.title,
      baseUrl: baseUrl.origin,
      sections: docs.sections.length,
      contentBytes: Buffer.byteLength(html),
    });
    return { exitCode: 0 };
  }

  const updateEndpoint = new URL(
    `${baseUrl.pathname.replace(/\/$/, "")}/api/v2/pages/${encodeURIComponent(options.pageId)}`,
    baseUrl.origin,
  );
  const updateResponse = await fetch(updateEndpoint, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: String(page.id),
      status: page.status ?? "current",
      title: page.title,
      body: { representation: "storage", value: html },
      version: {
        number: page.version.number + 1,
        message: "Synchronized from ArcShape Markdown",
      },
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!updateResponse.ok)
    throw new Error(
      `Confluence page update failed: HTTP ${updateResponse.status}`,
    );

  const updatedPage = await getPage(endpoint, auth);
  if (updatedPage.version.number !== page.version.number + 1) {
    printResult({
      action: "conflict",
      pageId: String(page.id),
      title: page.title,
      reason:
        "the Confluence page changed during synchronization; review the remote version before retrying",
    });
    return { exitCode: 1 };
  }
  const syncedDigest = digest(updatedPage.body?.storage?.value ?? html);
  await writeManifest(manifestPath, {
    pageId: String(updatedPage.id),
    digest: syncedDigest,
  });
  printResult({
    action: "updated",
    pageId: String(page.id),
    title: page.title,
    baseUrl: baseUrl.origin,
    sections: docs.sections.length,
    contentBytes: Buffer.byteLength(html),
    version: updatedPage.version.number,
  });
  return { exitCode: 0 };
}

async function getPage(endpoint, auth) {
  const response = await fetch(endpoint, {
    headers: { Accept: "application/json", Authorization: auth },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok)
    throw new Error(`Confluence page lookup failed: HTTP ${response.status}`);
  return response.json();
}

async function renderPage(docs) {
  const parts = [`<h1>${escapeHtml(docs.readme.title)}</h1>`];
  for (const section of docs.sections) {
    parts.push(`<h2>${escapeHtml(section.title)}</h2>`);
    parts.push(await marked.parse(section.body));
  }
  const sanitized = DOMPurify.sanitize(parts.join("\n"), {
    ALLOW_DATA_ATTR: false,
  });
  return sanitized.replace(/\s+$/, "");
}

function parseBaseUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("--base-url must be a valid HTTPS URL");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new Error(
      "--base-url must be HTTPS and cannot contain credentials or query parameters",
    );
  url.pathname = url.pathname.replace(/\/$/, "");
  return url;
}

async function readManifest(path) {
  try {
    const manifest = JSON.parse(await readFile(path, "utf8"));
    if (
      manifest.version !== 1 ||
      typeof manifest.digest !== "string" ||
      !/^sha256:[a-f\d]{64}$/.test(manifest.digest)
    )
      throw new Error("invalid manifest format");
    return manifest;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`cannot read Confluence sync manifest: ${error.message}`);
  }
}

async function writeManifest(path, manifest) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(
    path,
    `${JSON.stringify({ version: 1, ...manifest }, null, 2)}\n`,
    { mode: 0o600 },
  );
}

function digest(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function safePageId(value) {
  if (!/^[a-zA-Z0-9_-]+$/.test(value))
    throw new Error(
      "--page-id may contain only letters, numbers, hyphens, and underscores",
    );
  return value;
}

function isBlankHtml(value) {
  return (
    value
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;|&#160;|\u00a0/gi, "")
      .trim() === ""
  );
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function printResult(result) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
