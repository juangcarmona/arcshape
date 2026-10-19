import { readFile, writeFile } from "node:fs/promises";

const [file, sha, sourcePath] = process.argv.slice(2);
if (!file || !/^[a-f0-9]{40}$/i.test(sha ?? "") || !sourcePath) {
  throw new Error(
    "Usage: add-source-provenance.mjs <html-file> <commit-sha> <source-path>",
  );
}
let html = await readFile(file, "utf8");
const meta = `<p class="arcshape-source-provenance">Source revision: <a href="https://github.com/juangcarmona/arcshape/commit/${sha}">${sha}</a> · Canonical source: <a href="https://github.com/juangcarmona/arcshape/tree/${sha}/${sourcePath}">${sourcePath}</a></p>`;
if (!html.includes("</body>"))
  throw new Error("Generated snapshot has no body element");
html = html.replace("</body>", `${meta}</body>`);
await writeFile(file, html);
