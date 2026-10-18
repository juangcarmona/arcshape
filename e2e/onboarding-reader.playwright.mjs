import { execFile as execFileCallback } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";

const execFile = promisify(execFileCallback);
const repositoryRoot = resolve(import.meta.dirname, "..");
let target;
let siteFile;
let server;
let siteUrl;

test.beforeAll(async () => {
  target = await mkdtemp(join(tmpdir(), "arcshape-assurance-e2e-"));
  siteFile = join(target, "docs", "architecture-site", "index.html");
  await runCli(["init", "--target", target, "--no-agents", "--yes"]);
  await buildSite();

  server = createServer(async (_request, response) => {
    try {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(await readFile(siteFile));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      siteUrl = `http://127.0.0.1:${address.port}/`;
      resolveListen();
    });
  });
});

test.afterAll(async () => {
  if (server) await new Promise((resolveClose) => server.close(resolveClose));
  if (target) await rm(target, { recursive: true, force: true });
});

test("onboards, creates and updates architecture docs, and serves the reader", async ({
  page,
}) => {
  await page.goto(siteUrl);
  await expect(page.locator("aside.nav a[href='#/section/01']")).toHaveCount(1);
  await page.locator("aside.nav a[href='#/section/01']").click();
  await expect(page.locator(".doc-title")).toHaveText("Introduction and goals");

  const sectionFile = join(
    target,
    "docs",
    "architecture",
    "01-introduction-and-goals.md",
  );
  const authoredMarker = "Verified update journey for the ArcShape reader.";
  await writeFile(
    sectionFile,
    `${await readFile(sectionFile, "utf8")}\n## Verified update\n\n${authoredMarker}\n`,
  );
  await buildSite();
  await page.reload();
  await page.locator("aside.nav a[href='#/section/01']").click();
  await expect(page.locator(".doc-body")).toContainText(authoredMarker);
});

test("publishes the accessible deployment diagram from section 07 on a narrow viewport", async ({
  page,
}) => {
  const sourceSection = join(
    repositoryRoot,
    "docs",
    "architecture",
    "07-deployment-view.md",
  );
  const targetSection = join(
    target,
    "docs",
    "architecture",
    "07-deployment-view.md",
  );
  await writeFile(targetSection, await readFile(sourceSection, "utf8"));
  await buildSite();

  const generatedHtml = await readFile(siteFile, "utf8");
  expect(generatedHtml).toContain(
    "ArcShape documentation and package deployment paths",
  );
  expect(generatedHtml).toMatch(/\\u003cfigure class=\\"diagram\\"[\s\S]*?\\u003csvg/);

  const externalRequests = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:")) {
      externalRequests.push(request.url());
    }
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(siteUrl);
  await page.locator("#mobile-nav-toggle").click();
  await page.locator("aside.nav a[href='#/section/07']").click();

  const diagram = page.locator(
    'figure.diagram[role="img"][aria-label="ArcShape documentation and package deployment paths"]',
  );
  await expect(diagram).toHaveCount(1);
  const svg = diagram.locator("svg");
  await expect(svg).toBeVisible();

  const dimensions = await diagram.evaluate((figure) => {
    const figureRect = figure.getBoundingClientRect();
    const svgRect = figure.querySelector("svg").getBoundingClientRect();
    const bodyRect = document.querySelector(".doc-body").getBoundingClientRect();
    return {
      figureLeft: figureRect.left,
      figureRight: figureRect.right,
      svgRight: svgRect.right,
      bodyLeft: bodyRect.left,
      bodyRight: bodyRect.right,
    };
  });
  expect(dimensions.figureLeft).toBeGreaterThanOrEqual(dimensions.bodyLeft - 1);
  expect(dimensions.figureRight).toBeLessThanOrEqual(dimensions.bodyRight + 1);
  expect(dimensions.svgRight).toBeLessThanOrEqual(dimensions.figureRight - 1);
  expect(externalRequests).toEqual([]);
});

test("detects a broken generated reader route", async ({ page }) => {
  const original = await readFile(siteFile, "utf8");
  const broken = original.replace(
    'href="#/section/01" data-route="#/section/01"',
    'href="#/section/99" data-route="#/section/99"',
  );
  expect(broken).not.toBe(original);

  try {
    await writeFile(siteFile, broken);
    await page.goto(siteUrl);
    const expectedRoute = page.locator('aside.nav a[href="#/section/01"]');
    await expect(expectedRoute).toHaveCount(0);
    let assertionRejected = false;
    try {
      await expect(expectedRoute).toHaveCount(1, { timeout: 100 });
    } catch {
      assertionRejected = true;
    }
    expect(assertionRejected).toBe(true);
  } finally {
    await writeFile(siteFile, original);
  }
});

async function runCli(args) {
  await execFile(
    process.execPath,
    [join(repositoryRoot, "bin", "arcshape.mjs"), ...args],
    {
      cwd: target,
      timeout: 60_000,
    },
  );
}

async function buildSite() {
  await runCli([
    "site",
    "build",
    "--docs",
    "docs/architecture",
    "--out",
    siteFile,
    "--source-ref",
    "e2e-fixture",
  ]);
}
