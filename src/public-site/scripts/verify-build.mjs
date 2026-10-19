import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { locales } from "../src/data/locales.mjs";

const dist = resolve(process.env.SITE_OUT_DIR ?? "dist");
const css = await readFile(resolve(dist, "styles.css"), "utf8");
const expectedRoutes = new Set(Object.values(locales).map(({ path }) => path));
const base = process.env.SITE_BASE ?? "/";
if (!base.startsWith("/") || !base.endsWith("/"))
  throw new Error("SITE_BASE must start and end with a slash");
const requiredText = [
  "title",
  "description",
  "langName",
  "path",
  "brandHome",
  "mainNavigation",
  "principlesLabel",
  "eyebrow",
  "lead",
  "explore",
  "browse",
  "note",
  "heroArt",
  "workflowEyebrow",
  "workflowTitle",
  "workflowIntro",
  "artifactsEyebrow",
  "artifactsTitle",
  "artifactsIntro",
  "architecture",
  "canonicalSource",
  "sourceTitle",
  "sourceText",
  "generatedView",
  "readerTitle",
  "readerText",
  "closingEyebrow",
  "closingTitle",
  "closingIntro",
  "viewRepository",
  "footerText",
  "engineering",
  "skip",
];
const localePaths = new Set();
for (const [code, locale] of Object.entries(locales)) {
  if (locale.code !== code || !locale.path || !locale.langName)
    throw new Error(`Locale ${code} has incomplete route metadata`);
  if (localePaths.has(locale.path))
    throw new Error(`Duplicate locale route: ${locale.path}`);
  localePaths.add(locale.path);
  for (const key of requiredText) {
    if (typeof locale[key] !== "string" || !locale[key].trim())
      throw new Error(`Locale ${code} is missing ${key}`);
  }
  if (
    !Array.isArray(locale.headline) ||
    locale.headline.length !== 2 ||
    !Array.isArray(locale.coreText) ||
    locale.coreText.length !== 2 ||
    !Array.isArray(locale.principles) ||
    locale.principles.length !== 4 ||
    !Array.isArray(locale.stages) ||
    locale.stages.length !== 3 ||
    !Array.isArray(locale.steps) ||
    locale.steps.length !== 3 ||
    !locale.nav?.workflow ||
    !locale.nav?.artifacts
  )
    throw new Error(
      `Locale ${code} has incomplete page, navigation, or hero data`,
    );
  const path = locale.path === "/" ? "index.html" : `${code}/index.html`;
  const html = await readFile(resolve(dist, path), "utf8");
  for (const [label, pattern] of [
    ["document language", new RegExp(`<html lang="${code}"`)],
    [
      "localized title",
      new RegExp(`<title>${escapeRegExp(locale.title)}</title>`),
    ],
    [
      "localized description",
      new RegExp(
        `name="description" content="${escapeRegExp(locale.description)}"`,
      ),
    ],
    ["main landmark", /<main\b/],
  ]) {
    if (!pattern.test(html))
      throw new Error(`${code} output is missing ${label}`);
  }
  const counterparts = Object.values(locales).filter(
    ({ code: otherCode }) => otherCode !== code,
  );
  for (const choice of counterparts) {
    const href = `${base}${choice.path.slice(1)}`;
    if (!html.includes(`href="${href}" hreflang="${choice.code}"`))
      throw new Error(
        `${code} output is missing its ${choice.code} route counterpart`,
      );
  }
  expectedRoutes.delete(locale.path);
}
if (expectedRoutes.size)
  throw new Error(`Missing routes: ${[...expectedRoutes].join(", ")}`);
await access(resolve(dist, "styles.css"));
await access(resolve(dist, "assets/arcshape-lockup.webp"));
if (!/:focus-visible/.test(css))
  throw new Error("Public site is missing visible keyboard focus styling");
for (const locale of Object.values(locales)) {
  const path = locale.path === "/" ? "index.html" : `${locale.code}/index.html`;
  const output = await readFile(resolve(dist, path), "utf8");
  if (
    !output.includes("data-appearance-choice") ||
    !output.includes("arcshape-appearance")
  )
    throw new Error(`${path} is missing accessible appearance controls`);
  if (
    !/AI-driven engineering documentation/.test(output) ||
    /Architecture Documentation/.test(output)
  )
    throw new Error(
      `${path} does not use the AI-driven engineering documentation brand label`,
    );
}
console.log(
  "Public Astro output routes, locale metadata, and static assets passed.",
);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
