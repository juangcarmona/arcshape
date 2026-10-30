import { execFile as callback } from "node:child_process";
import { createServer } from "node:http";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  rm,
  readdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { test, expect } from "@playwright/test";

const execFile = promisify(callback);
const root = resolve(import.meta.dirname, "..");
const flow =
  'flowchart LR\n  accTitle: Reservation flow\n  Traveler[Traveler] -->|Request| API["API\nHTTP endpoint"]\n  API -->|Check| Available{Available}\n  Available -->|Retry| Traveler';
const sequence =
  "sequenceDiagram\n  accTitle: Reservation sequence\n  participant Client\n  participant API\n  alt Available\n    Client->>API: Reserve\n  else Unavailable\n    API-->>Client: Conflict\n  end";
let directory, output, snapshot, forced, server, url, section, source, sidecar;
const cli = (args) =>
  execFile(
    process.execPath,
    [join(root, "packages/cli/src/bin/arcshape.mjs"), ...args],
    { cwd: directory, timeout: 90000 },
  );
test.beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), "arcshape-mermaid-e2e-"));
  output = join(directory, "interactive");
  snapshot = join(directory, "snapshot.html");
  forced = join(directory, "forced");
  await cli(["init", "--target", directory, "--no-agents", "--yes"]);
  const diagrams = join(
    directory,
    "docs/architecture/06-runtime-view/diagrams",
  );
  await mkdir(diagrams);
  sidecar = join(diagrams, "sequence.json");
  await writeFile(
    sidecar,
    await readFile(
      join(
        root,
        "docs/architecture/08-crosscutting-concepts/diagrams/sequence.archify.json",
      ),
    ),
  );
  section = join(directory, "docs/architecture/06-runtime-view/README.md");
  source =
    (await readFile(section, "utf8")) +
    "\n\n```mermaid\n" +
    flow +
    "\n```\n\n## Unsupported sequence\n\n```mermaid\n" +
    sequence +
    "\n```\n\n## Native-only example\n\n![Confirm a booking](./diagrams/sequence.svg)\n<!-- arcshape-diagram-source: ./diagrams/sequence.json -->\n\n" +
    "More architecture context.\n\n".repeat(60);
  await writeFile(section, source);
  await cli(["site", "previews"]);
  await cli(["site", "previews", "--check"]);
  await cli(["site", "build", "--format", "interactive", "--out", output]);
  await cli(["site", "build", "--out", snapshot]);
  await cli([
    "site",
    "build",
    "--format",
    "interactive",
    "--archify-deep-dives",
    "off",
    "--out",
    forced,
  ]);
  server = createServer(async (request, response) => {
    try {
      const path = new URL(request.url, "http://localhost").pathname;
      const target = resolve(output, "." + path);
      if (!target.startsWith(output + sep)) throw new Error("Not found");
      response.setHeader(
        "content-type",
        path.endsWith(".mmd") ? "text/plain" : "text/html; charset=utf-8",
      );
      response.end(await readFile(target));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  url = `http://127.0.0.1:${server.address().port}/index.html#/section/06`;
});
test.afterAll(async () => {
  if (server) await new Promise((done) => server.close(done));
  if (directory) await rm(directory, { recursive: true, force: true });
});

test("keeps Mermaid in the article and opens a separate interactive Archify deep dive", async ({
  page,
  context,
}, info) => {
  await page.goto(url);
  const primary = page.locator("figure.diagram").first();
  await expect(page.locator("figure.diagram svg")).toHaveCount(2);
  await expect(primary.locator("iframe")).toHaveCount(0);
  await expect(page.locator("figure[data-native-diagram]")).toHaveCount(1);
  await expect(page.locator(".diagram-source")).toHaveCount(0);
  await expect(page.locator(".archify-deep-dive")).toHaveCount(1);
  await primary.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("mermaid-light.png") });
  const popupPromise = context.waitForEvent("page");
  await primary.getByRole("link", { name: "Deep dive with Archify" }).click();
  const popup = await popupPromise;
  await popup.waitForSelector("html[data-ready]");
  expect(await popup.evaluate(() => window.opener)).toBe(null);
  const runtime = popup.frames().find((f) => f.url() === "about:srcdoc");
  const node = runtime.locator('svg [data-node-id="API"]');
  await node.focus();
  await node.press("Enter");
  await expect
    .poll(() => runtime.evaluate(() => window.Archify.focus.active()))
    .toBe("API");
  const original = await context.request.get(
    new URL("source.mmd", popup.url()).href,
  );
  expect((await original.text()).trimEnd()).toBe(flow);
  await popup.screenshot({ path: info.outputPath("mermaid-dedicated.png") });
  await popup.close();
  await page.evaluate(
    () => (document.documentElement.dataset.appearance = "dark"),
  );
  await page.screenshot({ path: info.outputPath("mermaid-dark.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.getElementById("nav-close").click());
  await primary.scrollIntoViewIfNeeded();
  const bounds = await primary.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(391);
  await page.screenshot({ path: info.outputPath("mermaid-mobile.png") });
  expect(await readFile(section, "utf8")).toBe(source);
});

test("retains static offline diagrams and honors explicit Mermaid rendering", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route(/^https?:/, (route) => route.abort());
  await page.goto(pathToFileURL(snapshot).href);
  await expect(
    page.getByRole("img", { name: "Reservation flow" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Confirm a booking" }).first(),
  ).toBeVisible();
  await context.close();
  const html = await readFile(join(forced, "index.html"), "utf8");
  expect(await readdir(join(forced, "diagrams"))).toHaveLength(1);
  expect(html).not.toContain('class="native-open archify-deep-dive"');
});

test("rejects stale native previews and malformed Mermaid without changing published output", async () => {
  const manifest = await readFile(
    join(output, ".arcshape-output.json"),
    "utf8",
  );
  const original = await readFile(sidecar, "utf8");
  await writeFile(
    sidecar,
    original.replace("Confirm a booking", "Changed booking title"),
  );
  await expect(cli(["site", "previews", "--check"])).rejects.toThrow(
    /stale native preview/,
  );
  await expect(
    cli(["site", "build", "--format", "interactive", "--out", output]),
  ).rejects.toThrow(/stale native preview/);
  await writeFile(sidecar, original);
  await writeFile(
    section,
    source.replace("Traveler[Traveler]", "Traveler[Broken"),
  );
  await expect(
    cli(["site", "build", "--format", "interactive", "--out", output]),
  ).rejects.toThrow(
    /06-runtime-view\/README.md: Mermaid diagram 1: invalid Mermaid/,
  );
  await writeFile(section, source);
  expect(await readFile(join(output, ".arcshape-output.json"), "utf8")).toBe(
    manifest,
  );
});
