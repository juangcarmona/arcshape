import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hardenViewer } from "./harden-archify-viewer.mjs";

const revision = "208acba8d412335185b2056fedf54b3405df43fb";
const source = resolve(process.argv[2] ?? "");
if (!process.argv[2])
  throw new Error("Usage: node scripts/vendor-archify.mjs <pinned-checkout>");
if (
  execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: source,
    encoding: "utf8",
  }).trim() !== revision ||
  execFileSync("git", ["status", "--porcelain"], {
    cwd: source,
    encoding: "utf8",
  }).trim()
) {
  throw new Error("Archify checkout must be clean at the recorded revision");
}
const root = join(source, "archify");
const target = fileURLToPath(
  new URL("../packages/cli/assets/archify/", import.meta.url),
);
const types = [
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
];
const files = new Set([
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
  "assets/template.html",
  "schemas/common.schema.json",
]);
async function moduleClosure(file) {
  if (files.has(file)) return;
  files.add(file);
  const code = await readFile(join(root, file), "utf8");
  for (const match of code.matchAll(
    /^import\s+(?:[^;]*?\sfrom\s+)?['"]([^'"]+)['"]/gm,
  )) {
    if (match[1].startsWith(".")) {
      const dependency = resolve(root, dirname(file), match[1]);
      if (!dependency.startsWith(root + "/"))
        throw new Error("Unexpected vendor import");
      await moduleClosure(dependency.slice(root.length + 1));
    } else if (!match[1].startsWith("node:"))
      throw new Error(`Unexpected dependency ${match[1]}`);
  }
}
for (const type of types) {
  await moduleClosure(`renderers/${type}/render-${type}.mjs`);
  files.add(`schemas/${type}.schema.json`);
}
for (const file of await readdir(join(root, "locales")))
  if (file.endsWith(".json")) files.add(`locales/${file}`);
const inventory = {};
for (const file of [...files].sort()) {
  const original = await readFile(join(root, file), "utf8");
  let content = original;
  if (file === "assets/template.html") {
    if (!content.includes('<style id="archify-fonts">'))
      throw new Error("Font removal boundary changed");
    content = content.replace(
      /<style id="archify-fonts">[\s\S]*?<\/style>/,
      '<style id="archify-fonts"></style>',
    );
    content = hardenViewer(content);
  }
  if (file === "renderers/shared/generated-brand-marks.mjs")
    content =
      "// ArcShape distribution excludes third-party brand artwork.\nexport const BRAND_MARKS = Object.freeze([]);\n";
  content = content.replaceAll("'JetBrains Mono', ", "");
  await mkdir(dirname(join(target, file)), { recursive: true });
  await writeFile(join(target, file), content);
  inventory[file] = {
    upstreamSha256: createHash("sha256").update(original).digest("hex"),
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}
await writeFile(
  join(target, "inventory.json"),
  JSON.stringify(
    {
      name: "archify",
      version: "3.2.0",
      revision,
      source: "https://github.com/tt-a1i/archify",
      license: "MIT",
      tailoring:
        "No embedded fonts or third-party brand vectors. System monospace and generic symbols only. No upstream CLI/updater. Viewer URL-key dictionaries use Map/Set.",
      files: inventory,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Vendored ${files.size} pinned files without font/brand payloads`);
