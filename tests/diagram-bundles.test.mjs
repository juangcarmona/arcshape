import { it, expect, describe, beforeEach, afterEach } from "vitest";
import {
  readFile,
  mkdtemp,
  mkdir,
  writeFile,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { exportNativeMermaid } from "../packages/cli/src/arc42-site/native-mermaid.mjs";
import { parseMermaid } from "../packages/cli/src/arc42-site/mermaid-native.mjs";
import {
  companionContent,
  isGeneratedCompanion,
  unmodifiedCompanion,
} from "../packages/cli/src/arc42-site/bundle-format.mjs";
import { generatePreviews } from "../packages/cli/src/arc42-site/native-previews.mjs";
import { loadDocs } from "../packages/cli/src/arc42-site/loadDocs.mjs";

it.each([
  "architecture",
  "class",
  "dataflow",
  "erd",
  "lifecycle",
  "sequence",
  "timeline",
  "tree",
  "waterfall",
  "workflow",
])("exports valid standard Mermaid Markdown for %s", async (family) => {
  const source = await readFile(
    new URL(
      `../docs/architecture/08-crosscutting-concepts/diagrams/${family}.archify.json`,
      import.meta.url,
    ),
    "utf8",
  );
  const mermaid = exportNativeMermaid(source);
  await expect(parseMermaid(mermaid)).resolves.toHaveProperty("type");
  const markdown = companionContent(mermaid, source);
  expect(markdown.startsWith("```mermaid\n")).toBe(true);
  expect(markdown.endsWith("\n```\n")).toBe(true);
  expect(unmodifiedCompanion(markdown)).toBe(true);
  expect(
    unmodifiedCompanion(markdown.replace("accTitle:", "accTitle: changed")),
  ).toBe(false);
  expect(isGeneratedCompanion(markdown + "\nAuthored content\n")).toBe(false);
});

it("preserves sequence notes and semantic graph attributes, cardinalities and timings", async () => {
  const get = async (type) =>
    exportNativeMermaid(
      await readFile(
        new URL(
          `../docs/architecture/08-crosscutting-concepts/diagrams/${type}.archify.json`,
          import.meta.url,
        ),
        "utf8",
      ),
    );
  expect(await get("sequence")).toContain("One transaction");
  expect(await get("class")).toContain("execute(request): Booking");
  expect(await get("erd")).toContain("many → one");
  expect(await get("waterfall")).toContain("35–150 ms");
  expect(await get("timeline")).toContain("2026-10-20T10:00:00+02:00");
});

describe("coordinated bundles", () => {
  let root, section, dir, source, json, svg, md;
  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "arcshape-bundle-"));
    await writeFile(join(root, "README.md"), "# Architecture\n");
    for (let i = 1; i <= 12; i++) {
      const number = String(i).padStart(2, "0"),
        dir = join(root, `${number}-section`);
      await mkdir(dir);
      await writeFile(
        join(dir, "README.md"),
        `---\ntitle: Section ${number}\narc42-section: "${number}"\ndescription: Test section\n---\n\n# Section ${number}\n`,
      );
    }
    section = join(root, "06-section");
    dir = join(section, "diagrams");
    await mkdir(dir);
    source = await readFile(
      new URL(
        "../docs/architecture/08-crosscutting-concepts/diagrams/sequence.archify.json",
        import.meta.url,
      ),
      "utf8",
    );
    json = join(dir, "sequence.archify.json");
    svg = join(dir, "sequence.svg");
    md = join(dir, "sequence.md");
    await writeFile(json, source);
    await writeFile(
      join(section, "README.md"),
      (await readFile(join(section, "README.md"), "utf8")) +
        "\n![Booking](./diagrams/sequence.svg)\n<!-- arcshape-diagram-source: ./diagrams/sequence.archify.json -->\n",
    );
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  // Each journey has its own fixture and bounded browser work; do not share mutations.
  it("retains SVG-only compatibility for native features without Mermaid export", async () => {
    const segmented = JSON.parse(source);
    segmented.segments = [{ from: 130, to: 250, label: "Phase" }];
    await writeFile(json, JSON.stringify(segmented));
    await generatePreviews(root, { bundles: false });
    await generatePreviews(root, { bundles: false, check: true });
    await expect(readFile(md, "utf8")).rejects.toThrow();
    await expect(generatePreviews(root)).rejects.toThrow(/sequence segments/);
  }, 60000);

  it("generates and checks bundles without duplicate navigation", async () => {
    expect(await generatePreviews(root)).toBe(1);
    expect(await generatePreviews(root, { check: true })).toBe(1);
    expect((await loadDocs(root)).sections[5].supporting).toHaveLength(0);
    await writeFile(
      join(dir, "explanation.md"),
      "# Authored supporting text\n",
    );
    expect((await loadDocs(root)).sections[5].supporting).toHaveLength(1);
  }, 60000);

  it("detects stale bundles and safely regenerates both companions", async () => {
    await generatePreviews(root);
    await writeFile(
      json,
      source.replace("Confirm a booking", "Updated booking"),
    );
    await expect(generatePreviews(root, { check: true })).rejects.toThrow(
      /stale/,
    );
    await generatePreviews(root);
    expect(await readFile(md, "utf8")).toContain("Updated booking");
  }, 60000);

  it("refuses modified outputs and dangling symlink targets", async () => {
    await generatePreviews(root);
    const originalMd = await readFile(md, "utf8"),
      originalSvg = await readFile(svg, "utf8");
    await writeFile(
      md,
      originalMd.replace("Confirm a booking", "Edited companion"),
    );
    await expect(generatePreviews(root)).rejects.toThrow(/modified Markdown/);
    expect(await readFile(svg, "utf8")).toBe(originalSvg);
    await writeFile(md, originalMd);
    await writeFile(svg, originalSvg + "<!-- edited -->\n");
    await expect(generatePreviews(root)).rejects.toThrow(
      /modified generated SVG/,
    );
    await writeFile(svg, originalSvg);
    await writeFile(md, originalMd);
    await generatePreviews(root, { check: true });
    if (process.platform !== "win32") {
      await rm(md);
      await symlink(root + "-outside.md", md);
      await expect(generatePreviews(root)).rejects.toThrow();
    }
  }, 60000);
});
