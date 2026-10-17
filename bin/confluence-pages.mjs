import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  basename,
  dirname,
  join,
  posix,
  relative,
  resolve,
  sep,
} from "node:path";
import { lstat, readdir } from "node:fs/promises";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import { marked, Renderer } from "marked";
import { loadDocs } from "../tools/arc42-site/loadDocs.mjs";

const DOMPurify = createDOMPurify(new JSDOM("").window);

export async function syncConfluencePages(options) {
  const spaceId = requireValue(options.spaceId, "--space-id");
  const parentId = requireValue(options.parentId, "--parent-id");
  const prefix = options.titlePrefix ?? basename(process.cwd());
  const baseUrl = parseBaseUrl(requireValue(options.baseUrl, "--base-url"));
  const emailEnv = options.emailEnv ?? "CONFLUENCE_EMAIL";
  const tokenEnv = options.tokenEnv ?? "CONFLUENCE_API_TOKEN";
  const email = process.env[emailEnv];
  const token = process.env[tokenEnv];
  if (!email || !token)
    throw new Error(
      `set both ${emailEnv} and ${tokenEnv} environment variables before connecting`,
    );
  const auth = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  const docsDir = join(process.cwd(), options.docs ?? "docs/architecture");
  const docs = await loadDocs(docsDir);
  const sections = docs.sections.map((section) => ({
    source: toRepoPath(docsDir, section.file),
    title: `${prefix} — ${section.title}`,
    body: section.body,
  }));
  const includedPages = await loadIncludedPages(options.include ?? []);
  const sectionSources = new Set(sections.map((section) => section.source));
  sections.push(
    ...includedPages
      .filter((page) => !sectionSources.has(page.source))
      .map((page) => ({
        ...page,
        title: `${prefix} — ${page.title}`,
      })),
  );
  const readme = {
    source: toRepoPath(docsDir, docs.readme.file),
    title: `${prefix} — ${docs.readme.title}`,
    body: docs.readme.body,
    index: true,
  };
  const allPages = [...sections, readme];
  const pageBySource = new Map(allPages.map((page) => [page.source, page]));
  const manifestPath = join(
    process.cwd(),
    ".arcshape",
    "confluence-sync",
    `${safeId(spaceId)}-${safeId(parentId)}.json`,
  );
  const manifest = await readPagesManifest(manifestPath, spaceId, parentId);
  const outcomes = [];

  // Verify destination access even when the source pages are new.
  const parent = await getPage(baseUrl, parentId, auth);
  if (String(parent.spaceId) !== String(spaceId))
    throw new Error("--parent-id is not in the selected --space-id");

  if (options.dryRun) {
    for (const page of [...sections, readme]) {
      const existing = manifest.pages[page.source];
      if (!existing) {
        outcomes.push({
          source: page.source,
          action: "create",
          title: page.title,
          previewBytes: Buffer.byteLength(
            await renderPage(page, pageBySource, manifest.pages, baseUrl),
          ),
        });
        continue;
      }
      const remote = await getPage(baseUrl, existing.pageId, auth);
      const remoteDigest = digest(remote.body?.storage?.value ?? "");
      const html = await renderPage(
        page,
        pageBySource,
        manifest.pages,
        baseUrl,
      );
      const targetDigest = digest(html);
      const localDigest = targetDigest;
      outcomes.push({
        source: page.source,
        pageId: existing.pageId,
        action:
          remoteDigest === existing.digest
            ? existing.sourceDigest === localDigest
              ? "unchanged"
              : "update"
            : remoteDigest === targetDigest
              ? "unchanged"
              : "conflict",
        title: page.title,
        previewBytes: Buffer.byteLength(html),
      });
    }
    return printResult(outcomes, "dry-run");
  }

  // Publish section pages first so the README index can link to their IDs.
  for (const page of [...sections, readme]) {
    const html = await renderPage(page, pageBySource, manifest.pages, baseUrl);
    const outcome = await syncPage({
      page,
      html,
      baseUrl,
      auth,
      spaceId,
      parentId,
      manifest,
      manifestPath,
    });
    outcomes.push(outcome);
    if (outcome.action === "error" || outcome.action === "conflict") break;
  }

  const failed = outcomes.some(
    (item) => item.action === "error" || item.action === "conflict",
  );
  printResult(outcomes, failed ? "partial" : "synced");
  return { exitCode: failed ? 1 : 0, outcomes };
}

async function syncPage({
  page,
  html,
  baseUrl,
  auth,
  spaceId,
  parentId,
  manifest,
  manifestPath,
}) {
  const targetDigest = digest(html);
  const existing = manifest.pages[page.source];
  if (!existing) {
    try {
      const response = await fetch(endpoint(baseUrl, "/api/v2/pages"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceId: String(spaceId),
          parentId: String(parentId),
          status: "current",
          title: page.title,
          body: { representation: "storage", value: html },
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok)
        return {
          source: page.source,
          action: "error",
          reason: `Confluence page creation failed: HTTP ${response.status}`,
        };
      const created = await response.json();
      if (!created.id)
        return {
          source: page.source,
          action: "error",
          reason: "Confluence created a page but returned no page ID",
        };
      const remote = await getPage(baseUrl, created.id, auth);
      manifest.pages[page.source] = {
        pageId: String(remote.id),
        title: page.title,
        digest: digest(remote.body?.storage?.value ?? html),
        sourceDigest: targetDigest,
      };
      await writePagesManifest(manifestPath, manifest);
      return {
        source: page.source,
        action: "created",
        pageId: String(remote.id),
        title: page.title,
      };
    } catch (error) {
      return {
        source: page.source,
        action: "error",
        reason: safeNetworkError(error),
      };
    }
  }

  try {
    const remote = await getPage(baseUrl, existing.pageId, auth);
    const currentHtml = remote.body?.storage?.value ?? "";
    const currentDigest = digest(currentHtml);
    if (currentDigest === targetDigest) {
      existing.digest = currentDigest;
      existing.sourceDigest = targetDigest;
      await writePagesManifest(manifestPath, manifest);
      return {
        source: page.source,
        action: "unchanged",
        pageId: existing.pageId,
        title: remote.title,
      };
    }
    if (
      currentDigest === existing.digest &&
      existing.sourceDigest === targetDigest
    )
      return {
        source: page.source,
        action: "unchanged",
        pageId: existing.pageId,
        title: remote.title,
      };
    if (currentDigest !== existing.digest)
      return {
        source: page.source,
        action: "conflict",
        pageId: existing.pageId,
        title: remote.title,
        reason: "Confluence page changed since the previous ArcShape sync",
      };

    const update = await fetch(
      endpoint(baseUrl, `/api/v2/pages/${encodeURIComponent(existing.pageId)}`),
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(remote.id),
          status: remote.status ?? "current",
          title: remote.title,
          body: { representation: "storage", value: html },
          version: {
            number: remote.version.number + 1,
            message: "Synchronized from ArcShape Markdown",
          },
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );
    if (!update.ok)
      return {
        source: page.source,
        action: update.status === 409 ? "conflict" : "error",
        pageId: existing.pageId,
        title: remote.title,
        reason: `Confluence page update failed: HTTP ${update.status}`,
      };
    const updated = await getPage(baseUrl, existing.pageId, auth);
    if (updated.version.number !== remote.version.number + 1)
      return {
        source: page.source,
        action: "conflict",
        pageId: existing.pageId,
        title: remote.title,
        reason: "Confluence page changed during synchronization",
      };
    existing.digest = digest(updated.body?.storage?.value ?? html);
    existing.sourceDigest = targetDigest;
    await writePagesManifest(manifestPath, manifest);
    return {
      source: page.source,
      action: "updated",
      pageId: existing.pageId,
      title: updated.title,
      version: updated.version.number,
    };
  } catch (error) {
    return {
      source: page.source,
      action: "error",
      pageId: existing.pageId,
      reason: safeNetworkError(error),
    };
  }
}

async function renderPage(page, pageBySource, pageRecords, baseUrl) {
  const parts = [];
  if (page.index) {
    parts.push(await marked.parse(page.body));
    parts.push("<h2>Architecture documents</h2><ul>");
    for (const section of [...pageBySource.values()].filter(
      (item) => !item.index,
    )) {
      const target = pageRecords[section.source];
      const targetHref = target?.pageId
        ? pageUrl(baseUrl, target.pageId)
        : null;
      parts.push(
        targetHref
          ? `<li><a href="${escapeHtml(targetHref)}">${escapeHtml(section.title)}</a></li>`
          : `<li>${escapeHtml(section.title)} (created during sync)</li>`,
      );
    }
    parts.push("</ul>");
  } else {
    const renderer = new Renderer();
    const renderLink = renderer.link.bind(renderer);
    renderer.link = (token) => {
      const localPage = resolvePageLink(page.source, token.href, pageBySource);
      if (!localPage) return renderLink(token);
      const target = pageRecords[localPage.source];
      if (!target?.pageId) return renderLink(token);
      return `<a href="${escapeHtml(pageUrl(baseUrl, target.pageId))}"${token.title ? ` title="${escapeHtml(token.title)}"` : ""}>${token.text}</a>`;
    };
    parts.push(await marked.parse(page.body, { renderer }));
  }
  return DOMPurify.sanitize(parts.join("\n"), {
    ALLOW_DATA_ATTR: false,
  }).trim();
}

async function loadIncludedPages(includes) {
  const repository = resolve(process.cwd());
  const files = new Set();
  for (const include of includes) {
    const target = resolve(repository, include);
    if (!isInside(repository, target))
      throw new Error(`--include must stay inside the repository: ${include}`);
    await collectIncludedFiles(repository, target, files);
  }
  const pages = [];
  for (const file of [...files].sort()) {
    const content = await readFile(file, "utf8");
    const source = relative(repository, file).split(sep).join("/");
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(content);
    const body = frontmatter ? content.slice(frontmatter[0].length) : content;
    const frontmatterTitle = /^title:\s*["']?(.+?)["']?\s*$/m.exec(
      frontmatter?.[1] ?? "",
    )?.[1];
    const headingTitle = /^#\s+(.+?)\s*$/m.exec(body)?.[1];
    pages.push({
      source,
      title: frontmatterTitle ?? headingTitle ?? basename(file, ".md"),
      body,
    });
  }
  return pages;
}

async function collectIncludedFiles(repository, target, files) {
  let info;
  try {
    info = await lstat(target);
  } catch (error) {
    if (error.code === "ENOENT")
      throw new Error(
        `--include path does not exist: ${relative(repository, target)}`,
      );
    throw error;
  }
  if (info.isSymbolicLink())
    throw new Error(
      `--include path cannot be a symbolic link: ${relative(repository, target)}`,
    );
  if (info.isFile()) {
    if (target.toLowerCase().endsWith(".md")) files.add(target);
    else
      throw new Error(
        `--include file must be Markdown: ${relative(repository, target)}`,
      );
    return;
  }
  if (!info.isDirectory())
    throw new Error(
      `--include path must be a file or directory: ${relative(repository, target)}`,
    );
  for (const entry of await readdir(target, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const child = join(target, entry.name);
    if (entry.isDirectory())
      await collectIncludedFiles(repository, child, files);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      files.add(child);
  }
}

function toRepoPath(docsDir, file) {
  return relative(process.cwd(), join(docsDir, file)).split(sep).join("/");
}

function isInside(root, path) {
  const rel = relative(root, path);
  return (
    rel === "" ||
    (!rel.startsWith(`..${sep}`) && rel !== ".." && !rel.startsWith(sep))
  );
}

function resolvePageLink(source, href, pageBySource) {
  if (!href || href.startsWith("#")) return null;
  let url;
  try {
    url = new URL(href, "https://arcshape.invalid");
  } catch {
    return null;
  }
  if (
    url.origin !== "https://arcshape.invalid" ||
    !url.pathname.endsWith(".md")
  )
    return null;
  const target = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const resolved = posix.normalize(posix.join(posix.dirname(source), target));
  return pageBySource.get(resolved) ?? null;
}

async function getPage(baseUrl, pageId, auth) {
  const url = endpoint(
    baseUrl,
    `/api/v2/pages/${encodeURIComponent(pageId)}?body-format=storage`,
  );
  const response = await fetch(url, {
    headers: { Accept: "application/json", Authorization: auth },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok)
    throw new Error(`Confluence page lookup failed: HTTP ${response.status}`);
  const page = await response.json();
  if (!page.id || !page.title || !Number.isInteger(page.version?.number))
    throw new Error("Confluence returned an incomplete page response");
  return page;
}

function endpoint(baseUrl, path) {
  const normalizedBase = baseUrl.pathname.replace(/\/$/, "");
  return new URL(`${normalizedBase}${path}`, baseUrl.origin);
}

function pageUrl(baseUrl, pageId) {
  const path = `${baseUrl.pathname.replace(/\/$/, "")}/pages/viewpage.action`;
  const url = new URL(path, baseUrl.origin);
  url.searchParams.set("pageId", pageId);
  return url.href;
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
  return url;
}

async function readPagesManifest(path, spaceId, parentId) {
  try {
    const value = JSON.parse(await readFile(path, "utf8"));
    if (
      value.version !== 1 ||
      String(value.spaceId) !== String(spaceId) ||
      String(value.parentId) !== String(parentId) ||
      value.pages === null ||
      typeof value.pages !== "object" ||
      Array.isArray(value.pages) ||
      Object.values(value.pages).some(
        (page) =>
          !page ||
          typeof page.pageId !== "string" ||
          !page.pageId ||
          typeof page.digest !== "string" ||
          !/^sha256:[a-f\d]{64}$/.test(page.digest) ||
          (page.sourceDigest !== undefined &&
            (typeof page.sourceDigest !== "string" ||
              !/^sha256:[a-f\d]{64}$/.test(page.sourceDigest))),
      )
    )
      throw new Error("manifest has an unsupported or invalid format");
    return value;
  } catch (error) {
    if (error.code === "ENOENT")
      return {
        version: 1,
        spaceId: String(spaceId),
        parentId: String(parentId),
        pages: {},
      };
    throw new Error(`cannot read Confluence sync manifest: ${error.message}`);
  }
}

async function writePagesManifest(path, manifest) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`, {
    mode: 0o600,
  });
}

function printResult(outcomes, action) {
  process.stdout.write(
    `${JSON.stringify({ provider: "confluence", action, outcomes }, null, 2)}\n`,
  );
  return {
    exitCode: outcomes.some(
      (item) => item.action === "conflict" || item.action === "error",
    )
      ? 1
      : 0,
    outcomes,
  };
}

function requireValue(value, flag) {
  if (!value) throw new Error(`${flag} is required`);
  return value;
}

function safeId(value) {
  if (!/^[a-zA-Z0-9_-]+$/.test(String(value)))
    throw new Error(
      "Confluence space and parent IDs may contain only letters, numbers, hyphens, and underscores",
    );
  return String(value);
}

function digest(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
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

function safeNetworkError(error) {
  return error.name === "TimeoutError"
    ? "Confluence request timed out"
    : error.message;
}
