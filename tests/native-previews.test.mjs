import { beforeEach, afterEach, it, expect } from "vitest";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  symlink,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  nativeReferences,
  checkPreview,
  previewContent,
} from "../packages/cli/src/arc42-site/native-previews.mjs";
import { prepareDiagrams } from "../packages/cli/src/arc42-site/prepare-diagrams.mjs";
let root, source, options;
const pair =
  "![Sequence](./diagrams/sequence.svg)\n<!-- arcshape-diagram-source: ./diagrams/sequence.json -->\n";
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "arcshape-preview-test-"));
  await mkdir(join(root, "diagrams"));
  source = await readFile(
    new URL("./fixtures/native-diagrams/sequence.json", import.meta.url),
    "utf8",
  );
  await writeFile(join(root, "diagrams/sequence.json"), source);
  options = { docsDir: root, document: "README.md" };
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

it("finds one adjacent image/source pair and replaces it at its document position", async () => {
  const refs = await nativeReferences(pair, options);
  expect(refs).toHaveLength(1);
  expect(refs[0]).toMatchObject({ source, title: "Sequence" });
  const prepared = await prepareDiagrams(
    { file: "README.md", body: "Before\n\n" + pair + "\nAfter" },
    root,
    "off",
  );
  expect(prepared.body).toContain("Before\n\n");
  expect(prepared.body).toContain("```archify\n");
  expect(prepared.body).not.toContain("![Sequence]");
  expect(prepared.body).toContain("After");
});
it("detects missing, stale and fresh generated previews", async () => {
  const [reference] = await nativeReferences(pair, options);
  const diagram = { svg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>' };
  await expect(checkPreview(reference, diagram)).rejects.toThrow(
    /missing or stale/,
  );
  await writeFile(reference.previewPath, previewContent(diagram));
  await checkPreview(reference, diagram);
  await expect(
    checkPreview(reference, { svg: "<svg>changed</svg>" }),
  ).rejects.toThrow(/stale/);
});
it.each([
  pair.replace("./diagrams/sequence.json", "../outside.json"),
  pair.replace("./diagrams/sequence.json", "https://example.com/source.json"),
  pair.replace("./diagrams/sequence.svg", "../outside.svg"),
  pair.replace("![Sequence]", "![Sequence] more text "),
  pair + "\n" + pair,
])("rejects unsafe or ambiguous references", async (body) => {
  await expect(nativeReferences(body, options)).rejects.toThrow();
});
it("ignores comment-shaped text inside ordinary code fences", async () => {
  expect(await nativeReferences("```text\n" + pair + "\n```", options)).toEqual(
    [],
  );
});
it("rejects symlink escape before reading its target", async () => {
  if (process.platform === "win32") return;
  await symlink(tmpdir(), join(root, "outside"));
  await expect(
    nativeReferences(
      pair.replace("./diagrams/sequence.json", "./outside/secret.json"),
      options,
    ),
  ).rejects.toThrow(/symlink escapes/);
});
it("keeps sources unchanged and preserves duplicate Mermaid occurrences in order", async () => {
  const fence =
    '```mermaid\nflowchart LR\naccTitle: Price flow\nA["Price $&"] --> B[Done]\n```\n';
  const document = { file: "README.md", body: fence + "\nBetween\n\n" + fence };
  const before = document.body;
  const result = await prepareDiagrams(document, root, "auto");
  expect(document.body).toBe(before);
  expect(result.body.match(/```archify/g)).toHaveLength(2);
  expect(result.body).not.toContain("```mermaid");
  expect([...result.origins.values()][0].mermaid).toContain("Price $&");
  expect(result.body).toContain("Price $&");
  expect(result.body).toContain("Between");
}, 15000);

it("leaves Mermaid unchanged when native publication is disabled", async () => {
  const body =
    "```mermaid\nflowchart LR\naccTitle: Flow\nA[Start] --> B[End]\n```";
  expect(
    (await prepareDiagrams({ file: "README.md", body }, root, "off")).body,
  ).toBe(body);
});

it("does not replace literal fence examples before a real diagram", async () => {
  const fence =
    "```mermaid\nflowchart LR\naccTitle: Flow\nA[Start] --> B[End]\n```\n";
  const literal = "````markdown\n" + fence + "````\n\n";
  const { body } = await prepareDiagrams(
    { file: "README.md", body: literal + fence },
    root,
    "auto",
  );
  expect(body).toContain(literal);
  expect(body.match(/```archify/g)).toHaveLength(1);
});
