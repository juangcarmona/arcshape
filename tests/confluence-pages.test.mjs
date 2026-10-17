import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syncConfluencePages } from "../bin/confluence-pages.mjs";

const originalCwd = process.cwd();
const originalEmail = process.env.CONFLUENCE_EMAIL;
const originalToken = process.env.CONFLUENCE_API_TOKEN;
let root;
let pages;
let pageCounter;
let writeSpy;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "arcshape-confluence-"));
  await mkdir(join(root, "docs"), { recursive: true });
  await cp(
    join(originalCwd, "docs/architecture"),
    join(root, "docs/architecture"),
    {
      recursive: true,
    },
  );
  await mkdir(join(root, "docs/adr"), { recursive: true });
  await writeFile(
    join(root, "docs/adr/ADR-0001.md"),
    "# ADR 0001\n\nStatus: Proposed\n",
  );
  process.chdir(root);
  process.env.CONFLUENCE_EMAIL = "docs@example.com";
  process.env.CONFLUENCE_API_TOKEN = "not-a-real-token";
  pages = new Map();
  pageCounter = 0;
  writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => {
    return true;
  });
  vi.stubGlobal("fetch", async (input, init = {}) => {
    const url = new URL(input);
    const method = init.method ?? "GET";
    if (url.pathname.endsWith("/api/v2/pages/parent"))
      return json({
        id: "parent",
        title: "Architecture",
        spaceId: "space",
        version: { number: 1 },
      });
    if (url.pathname.endsWith("/api/v2/pages") && method === "POST") {
      const body = JSON.parse(init.body);
      const id = String(++pageCounter);
      pages.set(id, {
        id,
        title: body.title,
        spaceId: body.spaceId,
        status: "current",
        version: { number: 1 },
        body: { storage: { value: body.body.value } },
      });
      return json({ id });
    }
    const id = url.pathname.split("/").at(-1);
    const page = pages.get(id);
    if (!page) return json({ message: "missing" }, 404);
    if (method === "PUT") {
      const body = JSON.parse(init.body);
      page.body.storage.value = body.body.value;
      page.version.number = body.version.number;
      return json(page);
    }
    return json(page);
  });
});

afterEach(async () => {
  process.chdir(originalCwd);
  writeSpy.mockRestore();
  vi.unstubAllGlobals();
  if (originalEmail === undefined) delete process.env.CONFLUENCE_EMAIL;
  else process.env.CONFLUENCE_EMAIL = originalEmail;
  if (originalToken === undefined) delete process.env.CONFLUENCE_API_TOKEN;
  else process.env.CONFLUENCE_API_TOKEN = originalToken;
  await rm(root, { recursive: true, force: true });
});

describe("multi-page Confluence sync", () => {
  it("previews, creates an index and section pages, then recognizes a repeat sync", async () => {
    const options = {
      baseUrl: "https://example.atlassian.net/wiki",
      spaceId: "space",
      parentId: "parent",
      titlePrefix: "ArcShape",
      include: ["docs/adr"],
    };

    const preview = await syncConfluencePages({ ...options, dryRun: true });
    expect(preview.exitCode).toBe(0);
    expect(preview.outcomes).toHaveLength(14);
    expect(
      preview.outcomes.every((outcome) => outcome.action === "create"),
    ).toBe(true);
    expect(pages.size).toBe(0);

    const created = await syncConfluencePages(options);
    expect(created.exitCode).toBe(0);
    expect(
      created.outcomes.filter((outcome) => outcome.action === "created"),
    ).toHaveLength(14);
    expect(pages.size).toBe(14);
    const index = [...pages.values()].find(
      (page) => page.title === "ArcShape — Architecture Documentation",
    );
    expect(index.body.storage.value).toContain(
      "/wiki/pages/viewpage.action?pageId=",
    );

    const manifest = JSON.parse(
      await readFile(
        join(root, ".arcshape/confluence-sync/space-parent.json"),
        "utf8",
      ),
    );
    expect(Object.keys(manifest.pages)).toHaveLength(14);
    const repeated = await syncConfluencePages({ ...options, dryRun: true });
    expect(repeated.exitCode).toBe(0);
    expect(
      repeated.outcomes.every((outcome) => outcome.action === "unchanged"),
    ).toBe(true);
  });

  it("reports a conflict when a managed page changes remotely", async () => {
    const options = {
      baseUrl: "https://example.atlassian.net/wiki",
      spaceId: "space",
      parentId: "parent",
      titlePrefix: "ArcShape",
    };
    await syncConfluencePages(options);
    const managed = pages.get("1");
    managed.body.storage.value = "<p>edited on Confluence</p>";

    const result = await syncConfluencePages({ ...options, dryRun: true });
    expect(result.exitCode).toBe(1);
    expect(result.outcomes[0].action).toBe("conflict");
  });

  it("previews and publishes a repository update to a managed page", async () => {
    const options = {
      baseUrl: "https://example.atlassian.net/wiki",
      spaceId: "space",
      parentId: "parent",
      titlePrefix: "ArcShape",
    };
    await syncConfluencePages(options);
    const source = join(root, "docs/architecture/01-introduction-and-goals.md");
    const original = await readFile(source, "utf8");
    await writeFile(source, `${original}\nReviewed update.\n`);

    const preview = await syncConfluencePages({ ...options, dryRun: true });
    expect(preview.exitCode).toBe(0);
    expect(
      preview.outcomes.find(
        (outcome) =>
          outcome.source === "docs/architecture/01-introduction-and-goals.md",
      ).action,
    ).toBe("update");

    const updated = await syncConfluencePages(options);
    expect(updated.exitCode).toBe(0);
    expect(updated.outcomes[0].action).toBe("updated");
    expect(pages.get("1").version.number).toBe(2);
    const repeated = await syncConfluencePages({ ...options, dryRun: true });
    expect(repeated.outcomes[0].action).toBe("unchanged");
  });

  it("fails truthfully when credentials or destination permissions are missing", async () => {
    const options = {
      baseUrl: "https://example.atlassian.net/wiki",
      spaceId: "space",
      parentId: "parent",
      titlePrefix: "ArcShape",
    };
    delete process.env.CONFLUENCE_EMAIL;
    await expect(syncConfluencePages(options)).rejects.toThrow(
      "set both CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN",
    );
    process.env.CONFLUENCE_EMAIL = "docs@example.com";

    vi.stubGlobal(
      "fetch",
      async () => new Response("forbidden", { status: 403 }),
    );
    await expect(syncConfluencePages(options)).rejects.toThrow(
      "Confluence page lookup failed: HTTP 403",
    );
  });

  it("reports a failed create without claiming a successful sync", async () => {
    const options = {
      baseUrl: "https://example.atlassian.net/wiki",
      spaceId: "space",
      parentId: "parent",
      titlePrefix: "ArcShape",
    };
    vi.stubGlobal("fetch", async (input, init = {}) => {
      const url = new URL(input);
      if (url.pathname.endsWith("/api/v2/pages/parent"))
        return json({
          id: "parent",
          title: "Architecture",
          spaceId: "space",
          version: { number: 1 },
        });
      if (url.pathname.endsWith("/api/v2/pages") && init.method === "POST")
        return new Response("forbidden", { status: 403 });
      throw new Error(`unexpected request: ${url}`);
    });

    const result = await syncConfluencePages(options);
    expect(result.exitCode).toBe(1);
    expect(result.outcomes[0].action).toBe("error");
    expect(result.outcomes[0].reason).toContain("HTTP 403");
    expect(pages.size).toBe(0);
  });
});

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json" },
  });
}
