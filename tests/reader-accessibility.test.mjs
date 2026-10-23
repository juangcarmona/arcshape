import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { getPuppeteerLaunchOptions } from "../packages/cli/src/arc42-site/browser-options.mjs";
import { buildSnapshotHtml } from "../packages/cli/src/arc42-site/shell.mjs";

let browser;
let readerHtml;
let outputDirectory;

beforeAll(async () => {
  outputDirectory = await mkdtemp(join(tmpdir(), "arcshape-reader-tasks-"));
  const output = join(outputDirectory, "index.html");
  const generated = spawnSync(
    process.execPath,
    [
      "packages/cli/src/bin/arcshape.mjs",
      "site",
      "build",
      "--out",
      output,
      "--title",
      "ArcShape",
      "--source-ref",
      "main",
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  if (generated.status !== 0) {
    throw new Error(generated.stderr || generated.stdout);
  }
  readerHtml = await readFile(output, "utf8");
  browser = await puppeteer.launch({
    headless: true,
    ...getPuppeteerLaunchOptions(),
  });
}, 60_000);

afterAll(async () => {
  await browser?.close();
  if (outputDirectory) {
    await rm(outputDirectory, { recursive: true, force: true });
  }
}, 60_000);

describe("generated architecture reader", () => {
  it("links the brand to the public site without a redundant header caption", () => {
    expect(readerHtml).toContain(
      '<a class="brand-home" href="https://arcshape.dev" target="_blank" rel="noopener noreferrer" aria-label="ArcShape public site">',
    );
    expect(readerHtml).not.toContain('class="brand-caption"');
  });

  it("lets readers find answers to the ArcShape dogfood tasks", async () => {
    const tasks = [
      {
        query: "npm CLI workflows",
        section: "01",
        title: "Introduction and goals",
        answer: "Repository maintainer",
      },
      {
        query: "external AI providers",
        section: "08",
        title: "Cross-cutting concepts",
        answer: "external AI providers",
      },
      {
        query: "building blocks Responsibility",
        section: "05",
        title: "Building block view",
        answer: "Responsibility",
      },
      {
        query: "changed evidence removals",
        section: "06",
        title: "Runtime view",
        answer: "changed evidence",
      },
    ];

    for (const task of tasks) {
      const page = await browser.newPage();
      await page.setContent(readerHtml);
      await page.keyboard.press("/");
      await page.locator("#find-input").fill(task.query);
      await expect
        .poll(() => page.$$eval("#find-results a", (links) => links.length))
        .toBeGreaterThan(0);
      const resultRoutes = await page.$$eval("#find-results a", (links) =>
        links.map((link) => link.getAttribute("href")),
      );
      expect(resultRoutes, task.query).toContain(`#/section/${task.section}`);
      await page
        .locator(`#find-results a[href="#/section/${task.section}"]`)
        .click();
      await page.waitForFunction(
        ({ section, title }) =>
          location.hash === `#/section/${section}` &&
          document.querySelector(".doc-title")?.textContent === title,
        {},
        task,
      );
      expect(
        await page.$eval(".doc-body", (body) => body.textContent),
      ).toContain(task.answer);
      await page.close();
    }
  }, 60_000);

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

  it("renders nested supporting documents with breadcrumbs and route-driven expansion", async () => {
    const page = await browser.newPage();
    await page.setContent(createNestedReader());
    await page.evaluate(() => {
      location.hash = "#/section/09/decisions/sql/query";
    });
    await page.waitForFunction(
      () =>
        location.hash === "#/section/09/decisions/sql/query" &&
        document.querySelector(".doc-title")?.textContent === "Query details",
    );

    for (const path of ["decisions", "decisions/sql"]) {
      expect(
        await page.$eval(
          `aside.nav .nav-folder[data-folder-path="${path}"] > .nav-folder-row > button`,
          (button) => button.getAttribute("aria-expanded"),
        ),
      ).toBe("true");
    }
    expect(
      await page.$eval('aside.nav a[aria-current="page"]', (link) =>
        link.getAttribute("data-relative-file"),
      ),
    ).toBe("decisions/sql/query.md");

    expect(
      await page.$eval(".breadcrumbs", (nav) => nav.textContent),
    ).toContain("DecisionsSQLQuery details");
    expect(
      await page.$$eval(".breadcrumbs a", (links) =>
        links.map((link) => link.getAttribute("href")),
      ),
    ).toContain("#/section/09/decisions/README");
    expect(
      await page.$$eval(".breadcrumbs a", (links) =>
        links.map((link) => link.getAttribute("href")),
      ),
    ).toContain("#/section/09/decisions/sql/README");

    const toggleSelector =
      'aside.nav .nav-folder[data-folder-path="decisions/sql"] > .nav-folder-row > button';
    await page.$eval(toggleSelector, (button) => button.click());
    expect(
      await page.$eval(toggleSelector, (button) =>
        button.getAttribute("aria-expanded"),
      ),
    ).toBe("false");
    await page.focus(toggleSelector);
    await page.keyboard.press("Enter");
    expect(
      await page.$eval(toggleSelector, (button) =>
        button.getAttribute("aria-expanded"),
      ),
    ).toBe("true");
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
        const ratio = (foreground, background) => {
          const values = [luminance(foreground), luminance(background)].sort(
            (a, b) => b - a,
          );
          return (values[0] + 0.05) / (values[1] + 0.05);
        };
        const body = ratio(
          getComputedStyle(document.body).color,
          getComputedStyle(document.body).backgroundColor,
        );
        const badges = [
          ...document.querySelectorAll(".section-card .card-number"),
        ].map((badge) =>
          ratio(
            getComputedStyle(badge).color,
            getComputedStyle(badge).backgroundColor,
          ),
        );
        return { body, badges };
      }, appearance);
      expect(
        contrast.body,
        `${appearance} body-text contrast`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        Math.min(...contrast.badges),
        `${appearance} section-badge contrast`,
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

function createNestedReader() {
  const html = createReader();
  const sectionStart = html.indexOf('<script id="arc42-data"');
  const dataStart = html.indexOf(">", sectionStart) + 1;
  const dataEnd = html.indexOf("</script>", dataStart);
  const data = JSON.parse(html.slice(dataStart, dataEnd));
  data.sections[8].supporting = [
    {
      relativeFile: "decisions/README.md",
      route: "#/section/09/decisions/README",
      title: "Decisions",
      description: "",
      html: "<p>Decision index.</p>",
      breadcrumbs: [
        { label: "Decisions", route: "#/section/09/decisions/README" },
      ],
    },
    {
      relativeFile: "decisions/sql/README.md",
      route: "#/section/09/decisions/sql/README",
      title: "SQL",
      description: "",
      html: "<p>SQL decisions.</p>",
      breadcrumbs: [
        { label: "Decisions", route: "#/section/09/decisions/README" },
        { label: "SQL", route: "#/section/09/decisions/sql/README" },
      ],
    },
    {
      relativeFile: "decisions/sql/query.md",
      route: "#/section/09/decisions/sql/query",
      title: "Query details",
      description: "",
      html: "<p>Query details.</p>",
      breadcrumbs: [
        { label: "Decisions", route: "#/section/09/decisions/README" },
        { label: "SQL", route: "#/section/09/decisions/sql/README" },
      ],
    },
    {
      relativeFile: "decisions/api.md",
      route: "#/section/09/decisions/api",
      title: "API decision",
      description: "",
      html: "<p>API decision.</p>",
      breadcrumbs: [
        { label: "Decisions", route: "#/section/09/decisions/README" },
      ],
    },
  ];
  return buildSnapshotHtml({
    readme: data.readme,
    sections: data.sections,
    stackName: "ArcShape",
    revision: "1234567890abcdef",
  });
}
