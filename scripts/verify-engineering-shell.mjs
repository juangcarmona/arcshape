import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const out = resolve(process.argv[2] ?? "src/engineering-portal/dist");
const base = process.argv[3] ?? process.env.SITE_BASE ?? "/arcshape/";
if (!base.startsWith("/") || !base.endsWith("/"))
  throw new Error("SITE_BASE must start and end with a slash");
const html = await readFile(resolve(out, "index.html"), "utf8");
for (const route of [
  "model/",
  "architecture/",
  "diagrams/publication-boundaries.html",
]) {
  if (!html.includes(`href="${base}${route}"`))
    throw new Error(`Engineering shell is missing ${base}${route}`);
}
if (
  base !== "/" &&
  (html.includes('href="/model/') ||
    html.includes('href="/architecture/') ||
    html.includes('href="/diagrams/'))
)
  throw new Error("Engineering shell contains a root-absolute route");
await access(resolve(out, "diagrams/publication-boundaries.html"));
await access(resolve(out, "diagrams/manifest.json"));
console.log(`Engineering Astro shell verified at ${base}`);
