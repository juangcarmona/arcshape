import { createServer } from "node:http";
import { copyFile, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { test, expect } from "@playwright/test";

let server;
let origin;
let output;
const revision = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).stdout.trim();

test.beforeAll(async () => {
  output = await mkdtemp(join(tmpdir(), "arcshape-engineering-portal-"));
  const generated = spawnSync(
    process.execPath,
    ["node_modules/@prodshape/cli/dist/bin.js", "graph", "--format", "html"],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  if (generated.status !== 0)
    throw new Error(generated.stderr || generated.stdout);
  await mkdir(join(output, "model"), { recursive: true });
  await copyFile(
    ".product/generated/snapshot.html",
    join(output, "model/index.html"),
  );
  const provenance = spawnSync(
    process.execPath,
    [
      "scripts/add-source-provenance.mjs",
      join(output, "model/index.html"),
      revision,
      "docs/product/model",
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  if (provenance.status !== 0)
    throw new Error(provenance.stderr || provenance.stdout);
  const architecture = spawnSync(
    process.execPath,
    [
      "packages/cli/src/bin/arcshape.mjs",
      "site",
      "build",
      "--out",
      join(output, "architecture/index.html"),
      "--title",
      "ArcShape",
      "--source-ref",
      revision,
    ],
    { cwd: process.cwd(), env: process.env, encoding: "utf8" },
  );
  if (architecture.status !== 0)
    throw new Error(architecture.stderr || architecture.stdout);
  const portal = spawnSync(
    process.execPath,
    ["scripts/build-engineering-portal.mjs", "--out", output],
    {
      cwd: process.cwd(),
      env: { ...process.env, SOURCE_SHA: revision },
      encoding: "utf8",
    },
  );
  if (portal.status !== 0) throw new Error(portal.stderr || portal.stdout);
  server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const relative = pathname.startsWith("/arcshape/")
      ? pathname.slice("/arcshape/".length) || "index.html"
      : pathname.replace(/^\/+/, "") || "index.html";
    const base = resolve(output);
    const file = resolve(
      base,
      relative.endsWith("/") ? `${relative}index.html` : relative,
    );
    if (!file.startsWith(`${base}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      const types = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json",
      };
      response
        .writeHead(200, {
          "content-type": types[extname(file)] ?? "application/octet-stream",
        })
        .end(body);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolveListen) =>
    server.listen(0, "127.0.0.1", resolveListen),
  );
  origin = `http://127.0.0.1:${server.address().port}/arcshape/`;
});

test.afterAll(async () => {
  await new Promise((resolveClose) => server?.close(resolveClose));
  if (output) await rm(output, { recursive: true, force: true });
});

test("portal links to revision-stamped model and architecture routes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(origin);
  await expect(
    page.getByRole("heading", { name: "Engineering portal" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Product model/ }),
  ).toHaveAttribute("href", "model/");
  await expect(
    page.getByRole("link", { name: /Architecture documentation/ }),
  ).toHaveAttribute("href", "architecture/");
  await expect(
    page.getByRole("link", { name: revision }).first(),
  ).toHaveAttribute("href", new RegExp(`/commit/${revision}$`));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);

  await page.goto(`${origin}model/`);
  await expect(page.locator(".arcshape-source-provenance")).toContainText(
    revision,
  );
  await page.goto(`${origin}architecture/`);
  await expect(
    page.getByRole("heading", { name: "Architecture Documentation" }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  const readerFocus = await page.evaluate(() => {
    const active = document.activeElement;
    const style = getComputedStyle(active);
    return {
      tag: active.tagName,
      visible: active.getClientRects().length > 0,
      outline: style.outlineStyle,
    };
  });
  expect(readerFocus.visible).toBe(true);
  expect(readerFocus.outline).toBe("solid");
  await page.goto(`${origin}#/section/01`);
  await expect(page).toHaveURL(new RegExp(`/architecture/#/section/01$`));
  await expect(page.locator(".doc-title")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
