import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { test, expect } from "@playwright/test";

let server;
let origin;
test.beforeAll(async () => {
  const redirects = (await readFile("src/public-site/dist/_redirects", "utf8"))
    .trim()
    .split("\n")
    .map((line) => line.split(/\s+/));
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    const redirect = redirects.find(([from]) => from === pathname);
    if (redirect) {
      response.writeHead(Number(redirect[2]), { location: redirect[1] }).end();
      return;
    }
    const relative =
      decodeURIComponent(pathname).replace(/^\/+/, "") || "index.html";
    const file = resolve(
      "src/public-site/dist",
      relative.endsWith("/") ? `${relative}index.html` : relative,
    );
    if (!file.startsWith(resolve("src/public-site/dist") + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      const types = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript",
        ".webp": "image/webp",
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
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => new Promise((done) => server?.close(done)));

for (const route of ["/", "/arc42/"]) {
  test(`${route} remains readable at narrow and desktop widths in each appearance`, async ({
    page,
  }) => {
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme });
      for (const width of [320, 390, 768, 900, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${origin}${route}`);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(page.locator("#appearance")).toBeEnabled();
        const metrics = await page.evaluate(() => {
          const luminance = (color) => {
            const values = color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number)
              .map((v) => v / 255)
              .map((v) =>
                v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
              );
            return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
          };
          const visible = (el) =>
            el.checkVisibility() && el.getBoundingClientRect().height > 0;
          const textTargets = [
            ...document.querySelectorAll(
              "main p, main li, main a, main code, .navigation a, .appearance label",
            ),
          ].filter(visible);
          const contrasts = textTargets.map((el) => {
            let ancestor = el;
            while (
              getComputedStyle(ancestor).backgroundColor ===
                "rgba(0, 0, 0, 0)" &&
              ancestor.parentElement
            )
              ancestor = ancestor.parentElement;
            const values = [
              luminance(getComputedStyle(el).color),
              luminance(getComputedStyle(ancestor).backgroundColor),
            ].sort((a, b) => b - a);
            return (values[0] + 0.05) / (values[1] + 0.05);
          });
          const controls = [
            ...document.querySelectorAll(
              ".button, .navigation a, .appearance select, .menu summary, .section-nav a, .guide-section > a, footer a",
            ),
          ].filter(visible);
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            minText: Math.min(
              ...textTargets.map((el) =>
                parseFloat(getComputedStyle(el).fontSize),
              ),
            ),
            minBody: Math.min(
              ...[
                ...document.querySelectorAll(".steps p, .guide-section > p"),
              ].map((el) => parseFloat(getComputedStyle(el).fontSize)),
            ),
            contrast: Math.min(...contrasts),
            minTap: Math.min(
              ...controls.map((el) => el.getBoundingClientRect().height),
            ),
            outOfBounds: controls
              .filter(
                (el) =>
                  el.getBoundingClientRect().left < 0 ||
                  el.getBoundingClientRect().right > innerWidth,
              )
              .map((el) => el.textContent),
          };
        });
        expect(metrics.overflow, `${width} ${colorScheme}`).toBe(false);
        expect(metrics.minText).toBeGreaterThanOrEqual(14);
        expect(metrics.minBody).toBeGreaterThanOrEqual(16);
        expect(metrics.contrast).toBeGreaterThanOrEqual(4.5);
        expect(metrics.minTap).toBeGreaterThanOrEqual(44);
        expect(metrics.outOfBounds).toEqual([]);
      }
    }
  });
}

test("mobile menu supports keyboard, Escape, navigation, and appearance persistence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  await expect(page.locator("#appearance")).toBeEnabled();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Document your software architecture.",
  );
  await expect(page.locator(".hero-copy .eyebrow")).toHaveText(
    "Engineering documentation",
  );
  await expect(page.locator(".hero-copy")).not.toContainText("AI");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  expect(
    await page
      .locator(".skip")
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page
    .getByRole("link", { name: "ArcShape home", exact: true })
    .first()
    .focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "How it works", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("summary")).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).not.toBeVisible();
  await page.locator("summary").click();
  await page.getByLabel("Appearance", { exact: true }).selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-lh-theme", "dark");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About arc42" })
    .click();
  await expect(page).toHaveURL(`${origin}/arc42/`);
  await expect(
    page.getByRole("heading", { name: "A guide to arc42." }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-lh-theme", "dark");
  await page.locator("summary").click();
  await page.getByLabel("Appearance", { exact: true }).selectOption("auto");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light dark");
  const darkCanvas = await page
    .locator("html")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: "light" });
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).not.toBe(darkCanvas);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).not.toBeVisible();
});

test("guide contains twelve readable sections with official destinations and working anchors", async ({
  page,
}) => {
  await page.goto(`${origin}/arc42/`);
  await expect(page.locator(".guide-section")).toHaveCount(12);
  for (let number = 1; number <= 12; number++) {
    const section = page.locator(`#section-${number}`);
    await expect(section.getByRole("heading")).toBeVisible();
    await expect(section.locator(".example")).toBeVisible();
    await expect(section.getByRole("link")).toHaveAttribute(
      "href",
      `https://docs.arc42.org/section-${number}/`,
    );
  }
  await page
    .getByRole("navigation", { name: "arc42 sections" })
    .getByRole("link", { name: "12 Glossary" })
    .click();
  await expect(page).toHaveURL(`${origin}/arc42/#section-12`);
  await expect(
    page.getByRole("heading", { name: "Glossary", exact: true }),
  ).toBeInViewport();
});

test("retired Spanish routes permanently redirect to English", async ({
  request,
}) => {
  for (const path of ["/es", "/es/"]) {
    const response = await request.get(`${origin}${path}`, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe("/");
  }
});

test("both pages support 200% text, reduced motion, and navigation without JavaScript", async ({
  browser,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/arc42/"]) {
      await page.goto(`${origin}${route}`);
      await page.addStyleTag({ content: "html:root { font-size: 200%; }" });
      await expect(page.locator("html")).toHaveCSS("font-size", "32px");
      if (width <= 900) await page.locator("summary").click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        `${width} ${route} at 200% text`,
      ).toBe(false);
      await expect(page.getByRole("main")).toBeVisible();
      expect(
        await page
          .locator("main a")
          .first()
          .evaluate((el) => getComputedStyle(el).transitionDuration),
      ).toBe("0s");
    }
  }
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noScript = await context.newPage();
  await noScript.goto(origin);
  await expect(
    noScript.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await noScript
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About arc42" })
    .click();
  await expect(
    noScript.getByRole("heading", { name: "A guide to arc42." }),
  ).toBeVisible();
  await context.close();
});

test("blocked local storage keeps navigation and appearance usable", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  await page.locator("summary").click();
  await page.getByLabel("Appearance", { exact: true }).selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-lh-theme", "light");
});
