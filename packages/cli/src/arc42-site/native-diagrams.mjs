import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, open, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import { validateSchema } from "../../assets/archify/renderers/shared/validator.mjs";
import { validateCrossCollectionContracts } from "../../assets/archify/renderers/shared/cli.mjs";
import { getPuppeteerLaunchOptions } from "./browser-options.mjs";

const run = promisify(execFile);
const vendor = fileURLToPath(new URL("../../assets/archify/", import.meta.url));
export const nativeTypes = Object.freeze([
  "architecture",
  "sequence",
  "workflow",
  "lifecycle",
  "dataflow",
  "erd",
  "class",
  "tree",
  "timeline",
  "waterfall",
]);
const forbidden = new Set([
  "__proto__",
  "prototype",
  "constructor",
  "output",
  "brand",
  "translations",
  "source_evidence",
  "repository",
  "repository_evidence",
  "sourceEvidence",
  "sources",
  "assets",
  "href",
  "url",
  "src",
]);

export function parseNativeDiagram(
  source,
  { location = "archify diagram" } = {},
) {
  try {
    if (Buffer.byteLength(source) > 256 * 1024)
      throw new Error("source exceeds 256 KiB");
    const data = JSON.parse(source);
    let count = 0;
    function inspect(value, depth = 0) {
      if (++count > 12000 || depth > 20)
        throw new Error("source exceeds structural limits");
      if (
        typeof value === "string" &&
        (value.length > 4000 ||
          /[<>]|(?:https?:|data:|javascript:|file:)/i.test(value))
      )
        throw new Error(
          "labels must be bounded plain text without markup or resource URLs",
        );
      if (
        typeof value === "number" &&
        (!Number.isFinite(value) || Math.abs(value) > 20000)
      )
        throw new Error("numeric value exceeds supported canvas limits");
      if (Array.isArray(value) && value.length > 500)
        throw new Error("collection exceeds 500 entries");
      if (value && typeof value === "object")
        for (const [key, child] of Object.entries(value)) {
          if (forbidden.has(key))
            throw new Error(`unsupported privileged field: ${key}`);
          inspect(child, depth + 1);
        }
    }
    inspect(data);
    if (!nativeTypes.includes(data?.diagram_type))
      throw new Error("unsupported diagram_type");
    if (!data.meta?.title?.trim()) throw new Error("meta.title is required");
    data.meta.visual_preset ??= "blueprint";
    // Upstream requires this field; only ArcShape supplies it, never the author.
    data.meta.output = "diagram.html";
    validateSchema(data.diagram_type, data);
    validateCrossCollectionContracts(data.diagram_type, data);
    const collections = {
      architecture: ["components", "connections"],
      sequence: ["participants", "messages"],
      workflow: ["nodes", "edges"],
      lifecycle: ["states", "transitions"],
      dataflow: ["nodes", "flows"],
      erd: ["entities", "relationships"],
      class: ["types", "relationships"],
    }[data.diagram_type];
    if (collections) {
      const ids = new Set(data[collections[0]].map((node) => node.id));
      if (ids.size !== data[collections[0]].length)
        throw new Error("duplicate node IDs");
      for (const edge of data[collections[1]] ?? [])
        for (const end of ["from", "to"]) {
          const id = typeof edge[end] === "string" ? edge[end] : edge[end]?.id;
          if (id && !ids.has(id))
            throw new Error(`relationship references unknown node: ${id}`);
        }
    }
    return data;
  } catch (error) {
    throw new Error(`${location}: ${error.message}`, { cause: error });
  }
}

export function sanitizeNativeSvg(svg) {
  const window = new JSDOM("").window;
  try {
    let clean = createDOMPurify(window).sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      FORBID_TAGS: ["script", "foreignObject", "image", "a", "animate", "set"],
      FORBID_ATTR: ["href", "xlink:href"],
    });
    if (/@import/i.test(clean)) throw new Error("SVG contains a CSS import");
    clean = clean.replace(/url\(([^)]*)\)/gi, (original, value) => {
      const target = value.trim().replace(/^["']|["']$/g, "");
      return /^#[a-zA-Z0-9_-]+$/.test(target) ? original : "none";
    });
    return clean;
  } finally {
    window.close();
  }
}

export async function renderNativeDiagrams(sources) {
  const diagrams = sources.map((source, i) =>
    parseNativeDiagram(source, { location: `archify diagram ${i + 1}` }),
  );
  if (!diagrams.length) return [];
  const staging = await mkdtemp(join(tmpdir(), "arcshape-native-"));
  let browser;
  try {
    browser = await puppeteer.launch({
      ...getPuppeteerLaunchOptions(),
      headless: true,
    });
    const results = [];
    for (const [i, data] of diagrams.entries()) {
      const input = join(staging, `${i}.json`),
        output = join(staging, `${i}.html`);
      await writeFile(input, JSON.stringify(data));
      await run(
        process.execPath,
        [
          "--max-old-space-size=256",
          join(
            vendor,
            `renderers/${data.diagram_type}/render-${data.diagram_type}.mjs`,
          ),
          input,
          output,
        ],
        {
          cwd: staging,
          env: { LANG: "C.UTF-8", SYSTEMROOT: process.env.SYSTEMROOT ?? "" },
          timeout: 30000,
          maxBuffer: 1024 * 1024,
        },
      );
      const rendered = await open(output, "r");
      let html;
      try {
        if ((await rendered.stat()).size > 16 * 1024 * 1024)
          throw new Error("rendered diagram exceeds 16 MiB");
        html = await rendered.readFile("utf8");
      } finally {
        await rendered.close();
      }
      const page = await browser.newPage();
      try {
        page.setDefaultTimeout(15000);
        await page.setRequestInterception(true);
        page.on("request", (request) =>
          request.url().startsWith("data:") || request.url() === "about:blank"
            ? request.continue()
            : request.abort(),
        );
        await page.setContent(html, { waitUntil: "load", timeout: 15000 });
        await page.waitForFunction(() => window.Archify?.exportMenu);
        let exportTimer;
        const result = await Promise.race([
          page.evaluate(async () => {
            await document.fonts.ready;
            let captured;
            const original = URL.createObjectURL;
            URL.createObjectURL = (blob) => {
              captured = blob;
              return original(blob);
            };
            const click = HTMLAnchorElement.prototype.click;
            HTMLAnchorElement.prototype.click = function () {};
            try {
              await window.Archify.exportMenu.run("svg");
              if (!captured) throw new Error("SVG exporter returned no image");
              const box = document.querySelector(".diagram-container > svg")
                .viewBox.baseVal;
              return {
                svg: await captured.text(),
                width: box.width,
                height: box.height,
              };
            } finally {
              URL.createObjectURL = original;
              HTMLAnchorElement.prototype.click = click;
            }
          }),
          new Promise((_, reject) => {
            exportTimer = setTimeout(
              () => reject(new Error("SVG export exceeded 15 seconds")),
              15000,
            );
          }),
        ]).finally(() => clearTimeout(exportTimer));
        results.push({
          ...result,
          svg: sanitizeNativeSvg(result.svg),
          html,
          title: data.meta.title,
          type: data.diagram_type,
          hash: createHash("sha256").update(JSON.stringify(data)).digest("hex"),
        });
      } finally {
        await page.close();
      }
    }
    return results;
  } finally {
    await browser?.close();
    await rm(staging, { recursive: true, force: true });
  }
}
