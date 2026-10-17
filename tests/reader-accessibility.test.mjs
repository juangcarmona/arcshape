import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { getPuppeteerLaunchOptions } from "../tools/arc42-site/browser-options.mjs";
import { buildSnapshotHtml } from "../tools/arc42-site/shell.mjs";

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    ...getPuppeteerLaunchOptions(),
  });
});

afterAll(async () => {
  await browser?.close();
});

describe("generated architecture reader", () => {
  it("supports reader search and keyboard section navigation", async () => {
    const page = await browser.newPage();
    await page.setContent(createReader());
    await page.keyboard.press("/");
    await page.locator("#find-input").fill("payment storefront");
    await expect
      .poll(() => page.$$eval("#find-results a", (links) => links.length))
      .toBe(1);
    await page.keyboard.press("Enter");
    await page.waitForFunction(
      () =>
        location.hash === "#/section/03" &&
        document.querySelector(".doc-title")?.textContent ===
          "System scope and context",
    );
    expect(await page.evaluate(() => document.activeElement?.id)).toBe(
      "ov-find",
    );
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(
      () =>
        location.hash === "#/section/04" &&
        document
          .querySelector('aside.nav a[aria-current="page"]')
          ?.getAttribute("href") === "#/section/04",
    );
    expect(
      await page.$eval('aside.nav a[aria-current="page"]', (link) =>
        link.getAttribute("href"),
      ),
    ).toBe("#/section/04");
    await page.close();
  }, 30_000);

  it("keeps semantic landmarks, contrast, and navigation usable on mobile", async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });
    await page.setContent(createReader());

    expect(
      await page.$$eval("header.site", (elements) => elements.length),
    ).toBe(1);
    expect(
      await page.$$eval(
        'aside[aria-label="arc42 sections"]',
        (elements) => elements.length,
      ),
    ).toBe(1);
    expect(await page.$$eval("main#main", (elements) => elements.length)).toBe(
      1,
    );
    expect(await page.$eval("a.skip", (link) => link.textContent)).toBe(
      "Skip to content",
    );

    for (const appearance of ["light", "dark"]) {
      const contrast = await page.evaluate((choice) => {
        document.documentElement.setAttribute("data-appearance", choice);
        const foreground = getComputedStyle(document.body).color;
        const background = getComputedStyle(document.body).backgroundColor;
        const channels = (color) =>
          color
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number);
        const luminance = (color) => {
          const [r, g, b] = channels(color).map((channel) => {
            const value = channel / 255;
            return value <= 0.04045
              ? value / 12.92
              : ((value + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const values = [luminance(foreground), luminance(background)].sort(
          (a, b) => b - a,
        );
        return (values[0] + 0.05) / (values[1] + 0.05);
      }, appearance);
      expect(
        contrast,
        `${appearance} body-text contrast`,
      ).toBeGreaterThanOrEqual(4.5);
    }

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(horizontalOverflow).toBe(false);

    await page.locator("#mobile-nav-toggle").click();
    expect(
      await page.$eval("#mobile-nav-toggle", (button) =>
        button.getAttribute("aria-expanded"),
      ),
    ).toBe("true");
    await page.locator('aside.nav a[href="#/section/03"]').click();
    expect(
      await page.$eval("body", (body) =>
        body.classList.contains("mobile-nav-open"),
      ),
    ).toBe(false);
    await page.close();
  }, 30_000);
});

function createReader() {
  const names = [
    "Introduction and goals",
    "Architecture constraints",
    "System scope and context",
    "Solution strategy",
    "Building block view",
    "Runtime view",
    "Deployment view",
    "Cross-cutting concepts",
    "Architecture decisions",
    "Quality requirements",
    "Risks and technical debt",
    "Glossary",
  ];
  const sections = names.map((title, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title,
    description: `Reader guide for ${title.toLowerCase()}.`,
    html:
      index === 2
        ? "<p>The payment system accepts checkout requests from a storefront and authorizes charges through the card provider.</p>"
        : `<p>${title} for the ArcShape example system.</p>`,
  }));
  return buildSnapshotHtml({
    readme: {
      title: "ArcShape architecture",
      description: "Understand the system and how its parts fit together.",
      html: "<p>ArcShape helps maintainers document software systems.</p>",
    },
    sections,
    stackName: "ArcShape",
    revision: "1234567890abcdef",
  });
}
