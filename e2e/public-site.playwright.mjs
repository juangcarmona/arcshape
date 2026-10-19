import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { test, expect } from "@playwright/test";

let server;
let origin;
test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    const relative =
      decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      ).replace(/^\/+/, "") || "index.html";
    const file = resolve("src/public-site", relative);
    if (!file.startsWith(resolve("src/public-site") + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      const types = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".png": "image/png",
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
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(
  async () => new Promise((resolveClose) => server?.close(resolveClose)),
);

test("public site supports keyboard use, responsive layout, contrast, and image alternatives", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(origin);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await expect(page.locator(".skip")).toBeVisible();
  expect(
    await page
      .locator(".skip")
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "ArcShape home" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /Engineering portal/ }).first(),
  ).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("img", { name: /ArcShape — Architecture Documentation/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /engineering portal/i }).first(),
  ).toHaveAttribute("href", "https://juangcarmona.github.io/arcshape/");
  const metrics = await page.evaluate(() => {
    const luminance = (color) => {
      const [r, g, b] = color
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map((v) => Number(v) / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a, b) => {
      const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    const paper = getComputedStyle(document.body).backgroundColor;
    const textTargets = [
      document.querySelector(".button.primary"),
      document.querySelector(".lead"),
      document.querySelector(".note"),
      document.querySelector(".topbar nav a"),
      document.querySelector(".text-link"),
    ];
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      contrasts: textTargets.map((target) => {
        const style = getComputedStyle(target);
        return contrast(
          style.color,
          target.matches(".button.primary") ? style.backgroundColor : paper,
        );
      }),
      images: [...document.images].every(
        (image) =>
          image.alt.length > 0 && image.complete && image.naturalWidth > 0,
      ),
    };
  });
  expect(metrics.overflow).toBe(false);
  expect(metrics.contrasts.every((ratio) => ratio >= 4.5)).toBe(true);
  expect(metrics.images).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "How it works" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Artifacts", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /Engineering portal/ }).first(),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
