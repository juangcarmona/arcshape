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

const site = resolve(siteArgument);
const output = resolve(outputArgument);
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  headless: true,
  ...getPuppeteerLaunchOptions(),
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  const siteUrl = pathToFileURL(site).href;
  await page.goto(`${siteUrl}#/`, { waitUntil: "load" });
  await page.waitForSelector("#content .overview-intro");
  await page.screenshot({ path: join(output, "arcshape-overview.png") });

  await page.goto(`${siteUrl}#/section/03`, { waitUntil: "load" });
  await page.waitForFunction(
    () =>
      location.hash === "#/section/03" &&
      document.querySelector(".doc figure.diagram svg"),
  );
  await page.evaluate(() => {
    const main = document.querySelector("main#main");
    const diagram = document.querySelector(".doc figure.diagram");
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
      document.querySelector(".doc figure.diagram svg"),
  );
  await page.evaluate(() => {
    const main = document.querySelector("main#main");
    const diagram = document.querySelector(".doc figure.diagram");
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
} finally {
  await browser.close();
}
