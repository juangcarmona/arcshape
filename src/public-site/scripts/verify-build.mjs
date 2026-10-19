import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { locales } from "../src/data/locales.mjs";

const dist = resolve("dist");
const css = await readFile(resolve(dist, "styles.css"), "utf8");
const expectedRoutes = new Set(Object.values(locales).map(({ path }) => path));
for (const [code, locale] of Object.entries(locales)) {
  if (locale.code !== code || !locale.path || !locale.langName)
    throw new Error(`Locale ${code} has incomplete route metadata`);
  const path = locale.path === "/" ? "index.html" : `${code}/index.html`;
  const html = await readFile(resolve(dist, path), "utf8");
  for (const [label, pattern] of [
    ["document language", new RegExp(`<html lang="${code}"`) ],
    ["localized title", new RegExp(`<title>${escapeRegExp(locale.title)}</title>`) ],
    ["localized description", new RegExp(`name="description" content="${escapeRegExp(locale.description)}"`) ],
    ["main landmark", /<main\b/],
  ]) {
    if (!pattern.test(html)) throw new Error(`${code} output is missing ${label}`);
  }
  const counterparts = Object.values(locales).filter(({ code: otherCode }) => otherCode !== code);
  if (counterparts.some(({ code: otherCode }) => !html.includes(`hreflang="${otherCode}"`)))
    throw new Error(`${code} output is missing a language counterpart link`);
  expectedRoutes.delete(locale.path);
}
if (expectedRoutes.size) throw new Error(`Missing routes: ${[...expectedRoutes].join(", ")}`);
await access(resolve(dist, "styles.css"));
await access(resolve(dist, "assets/arcshape-lockup.png"));
if (!/:focus-visible/.test(css))
  throw new Error("Public site is missing visible keyboard focus styling");
for (const locale of Object.values(locales)) {
  const path = locale.path === "/" ? "index.html" : `${locale.code}/index.html`;
  const output = await readFile(resolve(dist, path), "utf8");
  if (/<script\b/i.test(output))
    throw new Error(`${path} must not include a browser runtime`);
}
console.log("Public Astro output routes, locale metadata, and static assets passed.");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
