import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

// Validate the exact root-based Astro output that the public Cloudflare build
// publishes. The former hand-authored index.html was removed in the Astro move.
const root = "src/public-site/dist";
const html = await readFile(join(root, "index.html"), "utf8");
const css = await readFile(join(root, "styles.css"), "utf8");
const required = [
  ["English document language", /<html lang="en">/],
  ["responsive viewport", /name="viewport"/],
  ["main landmark", /<main\b/],
  ["skip link", /class="skip" href="#main"/],
  ["visible keyboard focus", /:focus-visible/],
  ["narrow viewport layout", /@media\s*\(?max-width:/],
];
for (const [label, pattern] of required) {
  if (!pattern.test(`${html}\n${css}`))
    throw new Error(`Public site is missing ${label}`);
}
const requiredLinks = [
  [
    "engineering portal link",
    'href="https://juangcarmona.github.io/arcshape/"',
  ],
  ["GitHub project link", 'href="https://github.com/juangcarmona/arcshape"'],
];
for (const [label, link] of requiredLinks) {
  if (!html.includes(link)) throw new Error(`Public site is missing ${label}`);
}
const files = await readdir(join(root, "assets"));
for (const name of [
  "arcshape-icon.svg",
  "arcshape-icon-dark.svg",
  "arcshape-branding.svg",
  "arcshape-branding-dark.svg",
]) {
  if (!files.includes(name))
    throw new Error(`Theme-aware ArcShape brand asset ${name} is missing`);
}
if (files.some((file) => /product.?shape/i.test(file)))
  throw new Error(
    "ProductShape branded assets must not be used by ArcShape public site",
  );
if (!html.includes('alt="ArcShape — Engineering Documentation"'))
  throw new Error("Brand image needs the Engineering Documentation label");
console.log("Public Astro output checks passed.");
