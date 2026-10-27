import { execFile as callback } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";

const execFile = promisify(callback);
const root = resolve(import.meta.dirname, "..");
let directory, section, source, output, server, url;
const cli = (args) =>
  execFile(
    process.execPath,
    [join(root, "packages/cli/src/bin/arcshape.mjs"), ...args],
    { cwd: directory, timeout: 60000 },
  );
const build = () =>
  cli(["site", "build", "--format", "interactive", "--out", output]);

test.beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), "arcshape-native-e2e-"));
  output = join(directory, "preview");
  await cli(["init", "--target", directory, "--no-agents", "--yes"]);
  section = join(directory, "docs/architecture/06-runtime-view/README.md");
  const diagram = await readFile(
    join(root, "tests/fixtures/native-diagrams/sequence.json"),
    "utf8",
  );
  source =
    (await readFile(section, "utf8")) +
    "\n\n```archify\n" +
    diagram +
    "\n```\n\n" +
    "More architecture context.\n\n".repeat(80);
  await writeFile(section, source);
  await build();
  server = createServer(async (request, response) => {
    try {
      const path = new URL(request.url, "http://localhost").pathname;
      if (!path.startsWith("/docs/") || path.includes(".."))
        throw new Error("Not found");
      response.setHeader("content-type", "text/html; charset=utf-8");
      response.end(await readFile(join(output, path.slice(6) || "index.html")));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  url = `http://127.0.0.1:${server.address().port}/docs/index.html#/section/06`;
});
test.afterAll(async () => {
  if (server) await new Promise((done) => server.close(done));
  if (directory) await rm(directory, { recursive: true, force: true });
});

async function swipeTouch(page, x, y, dx, dy) {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y, id: 1 }],
    });
    for (let step = 1; step <= 6; step++) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          { x: x + (dx * step) / 6, y: y + (dy * step) / 6, id: 1 },
        ],
      });
      await page.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await cdp.detach();
  }
}

test("touch pans a zoomed diagram and scrolls the article at normal zoom", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto(url);
    const figure = page.locator("figure[data-native-diagram]");
    await expect(figure.locator("iframe[data-ready]")).toHaveCount(1);
    const runtime = page
      .frames()
      .find((frame) => frame.url() === "about:srcdoc");
    const container = runtime.locator(".diagram-container");
    const svg = container.locator(":scope > svg");
    for (let i = 0; i < 3; i++)
      await runtime.locator('[data-view="in"]').click();
    await expect(container).toHaveClass(/is-pannable/);
    await container.evaluate((element) => {
      window.__arcshapePointerCancels = 0;
      element.addEventListener(
        "pointercancel",
        () => window.__arcshapePointerCancels++,
      );
    });
    const beforePan = await svg.evaluate((element) => element.style.transform);
    const bounds = await container.boundingBox();
    await swipeTouch(page, bounds.x + 8, bounds.y + 160, 100, 50);
    expect(await runtime.evaluate(() => window.__arcshapePointerCancels)).toBe(
      0,
    );
    expect(await svg.evaluate((element) => element.style.transform)).not.toBe(
      beforePan,
    );
    await page.screenshot({ path: info.outputPath("native-touch-pan.png") });

    await runtime.locator('[data-view="reset"]').click();
    await expect(container).not.toHaveClass(/is-pannable/);
    await figure.scrollIntoViewIfNeeded();
    const beforeScroll = await page
      .locator("#main")
      .evaluate((main) => main.scrollTop);
    const resetBounds = await container.boundingBox();
    await swipeTouch(page, resetBounds.x + 8, resetBounds.y + 200, 0, -140);
    await expect
      .poll(() => page.locator("#main").evaluate((main) => main.scrollTop))
      .toBeGreaterThan(beforeScroll);
  } finally {
    await context.close();
  }
});

test("interactive diagrams work under a subpath, keep scrolling in the reader and fit narrow screens", async ({
  page,
  context,
}, info) => {
  const external = [];
  page.on("request", (request) => {
    if (
      /^https?:/.test(request.url()) &&
      !request.url().startsWith("http://127.0.0.1:")
    )
      external.push(request.url());
  });
  await page.goto(url);
  const figure = page.locator("figure[data-native-diagram]");
  await expect(figure.locator("iframe[data-ready]")).toHaveCount(1);
  const runtime = page.frames().find((frame) => frame.url() === "about:srcdoc");
  const node = runtime.locator('svg [data-node-id="api"]');
  await node.focus();
  await node.press("Enter");
  await expect(figure.locator(".native-open")).toHaveAttribute(
    "href",
    /focus=api/,
  );
  const link = await figure.locator(".native-open").getAttribute("href");
  await page.evaluate(() =>
    window.postMessage(
      { v: 1, type: "state", selection: { kind: "focus", id: "forged" } },
      "*",
    ),
  );
  await expect(figure.locator(".native-open")).toHaveAttribute("href", link);
  const zoom = runtime.locator('[data-view="reset"]');
  const percent = zoom.locator("[data-view-percent]");
  const originalZoom = await percent.textContent();
  await runtime.locator('[data-view="in"]').click();
  await expect(percent).not.toHaveText(originalZoom);
  const canvas = runtime.locator(".diagram-container > svg");
  const transform = await canvas.evaluate((svg) => svg.style.transform);
  const viewport = await runtime.locator(".diagram-container").boundingBox();
  await page.mouse.move(viewport.x + 8, viewport.y + 100);
  await page.mouse.down();
  await page.mouse.move(viewport.x - 32, viewport.y + 70, { steps: 5 });
  await page.mouse.up();
  await expect
    .poll(() => canvas.evaluate((svg) => svg.style.transform))
    .not.toBe(transform);
  await zoom.focus();
  await zoom.press("Enter");
  await expect(percent).toHaveText("100%");
  await figure.scrollIntoViewIfNeeded();
  const before = await page.locator("#main").evaluate((main) => main.scrollTop);
  const box = await figure.boundingBox();
  await page.mouse.move(box.x + box.width - 40, box.y + 100);
  await page.mouse.wheel(0, 200);
  await expect
    .poll(() => page.locator("#main").evaluate((main) => main.scrollTop))
    .toBeGreaterThan(before);
  await node.click();
  await expect(figure.locator(".native-open")).toHaveAttribute(
    "href",
    /focus=api/,
  );
  const popupPromise = context.waitForEvent("page");
  await figure.locator(".native-open").click();
  const popup = await popupPromise;
  await popup.waitForSelector("html[data-ready]");
  expect(await popup.evaluate(() => window.opener)).toBe(null);
  const dedicated = popup
    .frames()
    .find((frame) => frame.url() === "about:srcdoc");
  expect(await dedicated.evaluate(() => window.readerLink("focus=api"))).toBe(
    popup.url(),
  );
  const downloadPromise = popup.waitForEvent("download");
  await dedicated.locator("#btn-export").click();
  expect((await downloadPromise).suggestedFilename()).toBe("diagram.svg");
  await popup.close();
  await page.setViewportSize({ width: 390, height: 844 });
  await figure.scrollIntoViewIfNeeded();
  const bounds = await figure.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(391);
  expect(bounds.height).toBeLessThanOrEqual(620);
  expect(
    await runtime.evaluate(
      () => document.documentElement.scrollHeight <= innerHeight + 1,
    ),
  ).toBe(true);
  await page.screenshot({ path: info.outputPath("native-narrow.png") });
  expect(external).toEqual([]);
  await page.goto(url.replace("#/section/06", "#/section/01"));
  await expect(page.locator("[data-native-frame]")).toHaveCount(0);
});

test("failed builds preserve published output and installation never rewrites authored diagrams", async () => {
  const before = await readFile(join(output, ".arcshape-output.json"), "utf8");
  await expect(
    cli(["init", "--target", directory, "--no-agents", "--yes"]),
  ).rejects.toThrow(/conflict/);
  expect(await readFile(section, "utf8")).toBe(source);
  try {
    await writeFile(
      section,
      source.replace('"Confirmar una reserva"', '"<script>alert(1)</script>"'),
    );
    await expect(build()).rejects.toThrow(/plain text/);
    expect(await readFile(join(output, ".arcshape-output.json"), "utf8")).toBe(
      before,
    );
  } finally {
    await writeFile(section, source);
  }
});
