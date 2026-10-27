import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import { captureRegularFileBinding } from "../packages/cli/assets/archify/renderers/shared/atomic-output.mjs";
import {
  readFile,
  readdir,
  mkdtemp,
  writeFile,
  rm,
  mkdir,
  symlink,
  realpath,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { join } from "node:path";
import { tmpdir } from "node:os";
import puppeteer from "puppeteer";
import {
  nativeTypes,
  parseNativeDiagram,
  renderNativeDiagrams,
} from "../packages/cli/src/arc42-site/native-diagrams.mjs";
import {
  buildNativeViewer,
  nativeFigure,
} from "../packages/cli/src/arc42-site/native-viewer.mjs";
import { buildSnapshotHtml } from "../packages/cli/src/arc42-site/shell.mjs";
import {
  renderMarkdown,
  extractNativeSources,
} from "../packages/cli/src/arc42-site/render.mjs";
import {
  publishDirectory,
  checkPublicationTarget,
} from "../packages/cli/src/arc42-site/publish-directory.mjs";
import { getPuppeteerLaunchOptions } from "../packages/cli/src/arc42-site/browser-options.mjs";

const fixture = (type) =>
  readFile(
    new URL(`./fixtures/native-diagrams/${type}.json`, import.meta.url),
    "utf8",
  );
let results, sources, browser, server, url, directory;
beforeAll(async () => {
  sources = await Promise.all(nativeTypes.map(fixture));
  results = await renderNativeDiagrams(sources);
  results.forEach((result, i) => {
    result.id = nativeTypes[i];
  });
  directory = await realpath(
    await mkdtemp(join(tmpdir(), "arcshape-native-test-")),
  );
  const sequence = results.find((r) => r.type === "sequence");
  const html = buildSnapshotHtml({
    stackName: "Native diagrams",
    interactive: true,
    readme: {
      title: "Sequence",
      html:
        nativeFigure(sequence, true) +
        '<div style="height:1600px">Document continues</div>',
    },
    sections: [
      {
        number: "06",
        title: "Runtime",
        html:
          nativeFigure(sequence, true) +
          '<div style="height:1600px">Document continues</div>',
      },
    ],
  });
  const files = new Map([
    ["/index.html", html],
    ["/diagrams/sequence/index.html", buildNativeViewer(sequence)],
  ]);
  server = createServer((req, res) => {
    const body = files.get(new URL(req.url, "http://localhost").pathname);
    res.writeHead(body ? 200 : 404, { "Content-Type": "text/html" });
    res.end(body ?? "Not found");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${server.address().port}`;
  browser = await puppeteer.launch({
    ...getPuppeteerLaunchOptions(),
    headless: true,
  });
}, 120000);
afterAll(async () => {
  await browser?.close();
  await new Promise((resolve) => (server ? server.close(resolve) : resolve()));
  if (directory) await rm(directory, { recursive: true, force: true });
});

describe("pinned native renderer", () => {
  it("renders all ten families with static images and deterministic output", async () => {
    expect(results.map((r) => r.type)).toEqual(nativeTypes);
    for (const result of results) {
      expect(result.svg).toContain("<svg");
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.html).not.toContain("data:font");
    }
    const again = await renderNativeDiagrams([sources[1]]);
    expect(again[0].svg).toBe(results[1].svg);
    expect(again[0].html).toBe(results[1].html);
  }, 30000);
  it("verifies the vendor inventory and excludes brand/font artwork", async () => {
    const root = new URL("../packages/cli/assets/archify/", import.meta.url);
    const inventory = JSON.parse(
      await readFile(new URL("inventory.json", root)),
    );
    for (const [file, record] of Object.entries(inventory.files))
      expect(
        createHash("sha256")
          .update(await readFile(new URL(file, root)))
          .digest("hex"),
        file,
      ).toBe(record.sha256);
    expect(
      await readFile(
        new URL("renderers/shared/generated-brand-marks.mjs", root),
        "utf8",
      ),
    ).toContain("Object.freeze([])");
    expect(
      await readFile(new URL("assets/template.html", root), "utf8"),
    ).not.toContain("font/woff2");
  });
  it("rejects privileged, malformed and oversized input with its location", () => {
    for (const key of [
      "output",
      "brand",
      "repository",
      "sources",
      "translations",
    ]) {
      const data = JSON.parse(sources[1]);
      data.meta[key] = "bad";
      expect(() =>
        parseNativeDiagram(JSON.stringify(data), {
          location: "06/README.md:2",
        }),
      ).toThrow("06/README.md:2");
    }
    expect(() => parseNativeDiagram("{")).toThrow();
    expect(() => parseNativeDiagram(" ".repeat(256 * 1024 + 1))).toThrow(
      "256 KiB",
    );
    const data = JSON.parse(sources[1]);
    data.meta.title = "<script>alert(1)</script>";
    expect(() => parseNativeDiagram(JSON.stringify(data))).toThrow(
      "plain text",
    );
    data.meta.title = "Valid";
    data.messages[0].from = "missing";
    expect(() => parseNativeDiagram(JSON.stringify(data))).toThrow();
  });
  it("keeps native Markdown order and refuses missing render results", async () => {
    const body = "Before\n\n```archify\n" + sources[1] + "\n```\n\nAfter";
    expect(extractNativeSources(body).map((source) => source.trim())).toEqual([
      sources[1].trim(),
    ]);
    const rendered = await renderMarkdown(body, {
      fileToRoute: new Map(),
      nativeDiagrams: [nativeFigure(results[1], false)],
    });
    expect(rendered.html.indexOf("Before")).toBeLessThan(
      rendered.html.indexOf("<figure"),
    );
    expect(rendered.html.indexOf("After")).toBeGreaterThan(
      rendered.html.indexOf("</figure>"),
    );
    await expect(
      renderMarkdown(body, { fileToRoute: new Map() }),
    ).rejects.toThrow("Native diagram count");
  });
});

describe("native publication", () => {
  it("rejects an upstream file binding swapped between inspection and open", async () => {
    const target = join(directory, "binding.txt");
    await writeFile(target, "original");
    const originalOpen = fs.openSync;
    let swapped = false;
    const intercept = vi
      .spyOn(fs, "openSync")
      .mockImplementation((path, ...args) => {
        if (path === target && !swapped) {
          swapped = true;
          fs.renameSync(target, target + ".previous");
          fs.writeFileSync(target, "replacement");
        }
        return originalOpen(path, ...args);
      });
    try {
      const result = captureRegularFileBinding(target, {
        includeContent: true,
      });
      expect(swapped).toBe(true);
      expect(result.status).not.toBe("captured");
      expect(result.reason.code).toContain("changed-during-inspection");
    } finally {
      intercept.mockRestore();
    }
  });
  it("replaces only intact owned output and preserves unrelated/modified files", async () => {
    const output = join(directory, "site"),
      docs = join(directory, "docs");
    await publishDirectory(output, docs, new Map([["index.html", "first"]]));
    await publishDirectory(output, docs, new Map([["index.html", "second"]]));
    expect(await readFile(join(output, "index.html"), "utf8")).toBe("second");
    await writeFile(join(output, "authored.txt"), "mine");
    await expect(
      publishDirectory(output, docs, new Map([["index.html", "third"]])),
    ).rejects.toThrow("unrelated");
    expect(await readFile(join(output, "authored.txt"), "utf8")).toBe("mine");
    await expect(checkPublicationTarget(docs, docs)).rejects.toThrow("overlap");
    await expect(checkPublicationTarget(directory, docs)).rejects.toThrow(
      "overlap",
    );
    expect(
      (await readdir(directory)).some((file) =>
        file.startsWith(".arcshape-publish"),
      ),
    ).toBe(false);
  });
  it.skipIf(process.platform === "win32")(
    "refuses output symlink traversal",
    async () => {
      const target = join(directory, "target"),
        alias = join(directory, "alias");
      await mkdir(target);
      await symlink(target, alias, "dir");
      await expect(
        checkPublicationTarget(join(alias, "site"), join(directory, "docs")),
      ).rejects.toThrow("symlink");
    },
  );
});

describe("native viewer in a browser", () => {
  it("preserves reachability, routes and semantic lenses with hardened key collections", async () => {
    const page = await browser.newPage();
    await page.goto(url + "/diagrams/sequence/index.html");
    await page.waitForSelector("html[data-ready]");
    const runtime = page
      .frames()
      .find((frame) => frame.url() === "about:srcdoc");
    const state = await runtime.evaluate(() => {
      const nodes = [...document.querySelectorAll("svg [data-node-id]")].map(
        (node) => node.dataset.nodeId,
      );
      const focus = window.Archify.focus;
      focus.set("api", { updateUrl: false, toggle: false });
      focus.reach("downstream", {
        updateUrl: false,
        toggle: false,
        reveal: false,
      });
      const reach = focus.reachability();
      const snapshot = focus.reachabilitySnapshot();
      focus.clear({ updateUrl: false });
      const route = window.Archify.routeProbe;
      route.begin({ updateUrl: false });
      route.choose(nodes[0], { updateUrl: false });
      const context = route.finderContext();
      route.choose("api", { updateUrl: false });
      const path = route.result();
      route.clear({ updateUrl: false });
      const lens = window.Archify.semanticLens;
      lens.select("backend", { updateUrl: false });
      return {
        reach,
        snapshot,
        context,
        path,
        kinds: lens.active(),
        matched: document.querySelectorAll("[data-lens-selected]").length,
      };
    });
    expect(state.reach.nodeIds).toContain("api");
    expect(state.reach.nodeIds.length).toBeGreaterThan(1);
    expect(state.snapshot.depths.api).toBe(0);
    expect(state.context).toBeTruthy();
    expect(state.path.nodes).toContain("api");
    expect(state.path.hops).toBeGreaterThan(0);
    expect(state.kinds).toContain("backend");
    expect(state.matched).toBeGreaterThan(0);
    await page.close();
  });
  it("isolates embedded and dedicated runtimes while preserving focus and theme", async () => {
    const page = await browser.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text().slice(0, 500));
    });
    await page.goto(url + "/index.html#/section/06");
    await page
      .waitForSelector("[data-native-frame][data-ready]", {
        timeout: 10000,
      })
      .catch((error) => {
        throw new Error(error.message + "\n" + errors.join("\n"));
      });
    const runtime = page.frames().find((f) => f.url() === "about:srcdoc");
    expect(runtime).toBeTruthy();
    expect(
      await runtime.evaluate(() => {
        try {
          localStorage.getItem("test");
          return false;
        } catch {
          return true;
        }
      }),
    ).toBe(true);
    expect(
      await runtime.evaluate(() => {
        try {
          return Boolean(parent.document);
        } catch {
          return false;
        }
      }),
    ).toBe(false);
    await runtime.click('[data-node-id="api"]');
    await page.waitForFunction(() =>
      document.querySelector(".native-open").hash.includes("focus=api"),
    );
    const previousFrame = await page.$("[data-native-frame]");
    await page.click('[data-appearance-set="dark"]');
    await page.waitForFunction(
      (frame) => !frame.isConnected,
      {},
      previousFrame,
    );
    await page.waitForSelector("[data-native-frame][data-ready]");
    const themed = page.frames().find((f) => f.url() === "about:srcdoc");
    await themed.waitForFunction(
      () => document.documentElement.dataset.theme === "dark",
    );
    const target = await page.$eval(".native-open", (link) => link.href);
    await page.goto(target);
    await page.waitForSelector("html[data-ready]");
    const dedicated = page.frames().find((f) => f.url() === "about:srcdoc");
    await dedicated.waitForFunction(
      () => window.Archify.focus.active() === "api",
    );
    expect(
      await dedicated.evaluate(() => document.documentElement.dataset.theme),
    ).toBe("dark");
    expect(
      await dedicated.evaluate(() => {
        try {
          localStorage.setItem("test", "x");
          return false;
        } catch {
          return true;
        }
      }),
    ).toBe(true);
    expect(await dedicated.evaluate(() => window.opener)).toBe(null);
    expect(errors).toEqual([]);
    await page.close();
  }, 30000);
  it("exposes static diagrams with JavaScript disabled", async () => {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    for (const path of ["/index.html", "/diagrams/sequence/index.html"]) {
      await page.goto(url + path);
      expect(
        await page.$eval(
          'img[alt="Confirmar una reserva"]',
          (image) =>
            image.getBoundingClientRect().width > 0 &&
            image.complete &&
            image.naturalWidth > 0,
        ),
      ).toBe(true);
    }
    await page.close();
  });
  it("keeps the static fallback when the viewer cannot load", async () => {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) =>
      request.url().includes("/diagrams/")
        ? request.abort()
        : request.continue(),
    );
    await page.goto(url + "/index.html#/section/06");
    await page.waitForSelector(".native-viewport img");
    expect(
      await page.$eval(
        ".native-viewport img",
        (image) =>
          image.naturalWidth > 0 &&
          getComputedStyle(image).visibility === "visible" &&
          getComputedStyle(image).zIndex === "1",
      ),
    ).toBe(true);
    expect(await page.$eval(".native-open", (link) => link.target)).toBe(
      "_blank",
    );
    await page.close();
  });
  it("blocks viewer network connections independently of input validation", async () => {
    const page = await browser.newPage();
    const outgoing = [];
    page.on("request", (request) => {
      if (request.url().includes("arcshape.invalid"))
        outgoing.push(request.url());
    });
    await page.goto(url + "/diagrams/sequence/index.html");
    await page.waitForSelector("html[data-ready]");
    const runtime = page
      .frames()
      .find((frame) => frame.url() === "about:srcdoc");
    expect(
      await runtime.evaluate(async () => {
        try {
          await fetch("https://arcshape.invalid/private");
          return false;
        } catch {
          return true;
        }
      }),
    ).toBe(true);
    expect(outgoing).toEqual([]);
    await page.close();
  });
});
