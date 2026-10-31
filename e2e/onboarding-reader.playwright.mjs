import { execFile as execFileCallback } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile, cp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
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
  await execFile("git", ["init", "-b", "main"], { cwd: target });
  await execFile("git", ["config", "user.name", "ArcShape E2E"], {
    cwd: target,
  });
  await execFile("git", ["config", "user.email", "e2e@arcshape.invalid"], {
    cwd: target,
  });
  await execFile(
    "git",
    ["remote", "add", "origin", "https://github.com/example/arcshape.git"],
    { cwd: target },
  );
  await execFile("git", ["add", "docs/architecture"], { cwd: target });
  await execFile("git", ["commit", "-m", "test: create architecture fixture"], {
    cwd: target,
  });
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
    "01-introduction-and-goals",
    "README.md",
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
    "07-deployment-view",
    "README.md",
  );
  const targetSection = join(
    target,
    "docs",
    "architecture",
    "07-deployment-view",
    "README.md",
  );
  await writeFile(targetSection, await readFile(sourceSection, "utf8"));
  await cp(
    join(dirname(sourceSection), "diagrams"),
    join(dirname(targetSection), "diagrams"),
    { recursive: true },
  );
  await buildSite();

  const generatedHtml = await readFile(siteFile, "utf8");
  const diagramTitle = "ArcShape publication and adopter deployment boundaries";
  expect(generatedHtml).toContain(diagramTitle);
  expect(generatedHtml).toMatch(
    /\\u003cfigure class=\\"native-diagram\\"[\s\S]*?data:image\/svg\+xml;base64,/,
  );

  const externalRequests = [];
  page.on("request", (request) => {
    if (
      /^https?:/.test(request.url()) &&
      !request.url().startsWith("http://127.0.0.1:")
    ) {
      externalRequests.push(request.url());
    }
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${siteUrl}#/section/07`);

  const diagram = page.locator("figure.native-diagram").filter({
    has: page.getByRole("img", { name: diagramTitle }),
  });
  await expect(diagram).toHaveCount(1);
  await diagram.scrollIntoViewIfNeeded();
  const svg = diagram.getByRole("img", { name: diagramTitle });
  await expect(svg).toBeVisible();
  await expect(svg).toHaveAttribute("src", /^data:image\/svg\+xml;base64,/);
  for (const extension of ["archify.json", "svg", "md", "png"]) {
    const relative = join("diagrams", `deployment.${extension}`);
    expect(await readFile(join(dirname(targetSection), relative))).toEqual(
      await readFile(join(dirname(sourceSection), relative)),
    );
  }
  await expect(
    page.locator('aside.nav a[href*="/diagrams/deployment"]'),
  ).toHaveCount(0);

  const dimensions = await diagram.evaluate((figure) => {
    const figureRect = figure.getBoundingClientRect();
    const svgRect = figure.querySelector("img").getBoundingClientRect();
    const bodyRect = document
      .querySelector(".doc-body")
      .getBoundingClientRect();
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
  expect(dimensions.svgRight).toBeLessThanOrEqual(dimensions.figureRight + 1);
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
    [
      join(repositoryRoot, "packages", "cli", "src", "bin", "arcshape.mjs"),
      ...args,
    ],
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
