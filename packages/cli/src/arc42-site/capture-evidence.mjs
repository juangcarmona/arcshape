#!/usr/bin/env node

import { mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";
import { getPuppeteerLaunchOptions } from "./browser-options.mjs";

const [siteArgument, outputArgument] = process.argv.slice(2);
if (!siteArgument || !outputArgument) {
  process.stderr.write(
    "Usage: node capture-evidence.mjs <site.html> <output-directory>\n",
  );
  process.exit(2);
}

const output = resolve(outputArgument);
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  headless: true,
  ...getPuppeteerLaunchOptions(),
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  const siteUrl = /^https?:\/\//.test(siteArgument)
    ? siteArgument.replace(/\/$/, "/index.html")
    : pathToFileURL(resolve(siteArgument)).href;
  await page.goto(`${siteUrl}#/`, { waitUntil: "load" });
  await page.waitForSelector("#content .section-cards .section-card");
  await page.screenshot({ path: join(output, "arcshape-overview.png") });

  await page.goto(`${siteUrl}#/section/03`, { waitUntil: "load" });
  await page.waitForFunction(
    () =>
      location.hash === "#/section/03" &&
      document.querySelector(
        ".doc figure.diagram svg, .doc figure.native-diagram img",
      ),
  );
  if (await page.$("[data-native-frame]"))
    await page.waitForSelector("[data-native-frame][data-ready]");
  await page.evaluate(() => {
    const main = document.querySelector("main#main");
    const diagram = document.querySelector(
      ".doc figure.diagram, .doc figure.native-diagram",
    );
    if (main && diagram) {
      main.style.scrollBehavior = "auto";
      const mainBounds = main.getBoundingClientRect();
      const diagramBounds = diagram.getBoundingClientRect();
      main.scrollTop = Math.max(
        0,
        main.scrollTop +
          diagramBounds.top -
          mainBounds.top -
          (main.clientHeight - diagramBounds.height) / 2,
      );
    }
  });
  await page.screenshot({ path: join(output, "arcshape-system-context.png") });

  await page.goto(`${siteUrl}#/section/05`, { waitUntil: "load" });
  await page.waitForFunction(
    () =>
      location.hash === "#/section/05" &&
      document.querySelector(
        ".doc figure.diagram svg, .doc figure.native-diagram img",
      ),
  );
  if (await page.$("[data-native-frame]"))
    await page.waitForSelector("[data-native-frame][data-ready]");
  await page.evaluate(() => {
    const main = document.querySelector("main#main");
    const diagram = document.querySelector(
      ".doc figure.diagram, .doc figure.native-diagram",
    );
    if (main && diagram) {
      main.style.scrollBehavior = "auto";
      const mainBounds = main.getBoundingClientRect();
      const diagramBounds = diagram.getBoundingClientRect();
      main.scrollTop = Math.max(
        0,
        main.scrollTop +
          diagramBounds.top -
          mainBounds.top -
          (main.clientHeight - diagramBounds.height) / 2,
      );
    }
  });
  await page.screenshot({
    path: join(output, "arcshape-building-blocks.png"),
  });
  if (await page.$("[data-native-frame]")) {
    const viewer = page
      .frames()
      .find((frame) => frame.url() === "about:srcdoc");
    await viewer.click('[data-node-id="cli"]');
    await page.waitForFunction(() =>
      document.querySelector(".native-open").hash.includes("focus=cli"),
    );
    await page.screenshot({
      path: join(output, "arcshape-container-focus.png"),
    });
    const dedicated = await page.$eval(".native-open", (link) => link.href);
    await page.goto(dedicated);
    await page.waitForSelector("html[data-ready]");
    await page.screenshot({ path: join(output, "arcshape-dedicated.png") });
    await page.goto(`${siteUrl}#/section/03`);
    await page.click('[data-appearance-set="dark"]');
    await page.waitForSelector('html[data-appearance="dark"]');
    await page.$eval("figure.native-diagram", (element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await page.waitForSelector("[data-native-frame][data-ready]");
    await page.screenshot({ path: join(output, "arcshape-native-dark.png") });
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.click('[data-appearance-set="light"]');
    await page.waitForSelector('html[data-appearance="light"]');
    await page.$eval("figure.native-diagram", (element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await page.waitForSelector("[data-native-frame][data-ready]");
    await page.screenshot({ path: join(output, "arcshape-native-narrow.png") });
  }
} finally {
  await browser.close();
}
