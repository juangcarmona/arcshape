import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = "src/public-site";
const html = await readFile(join(root, "index.html"), "utf8");
const css = await readFile(join(root, "styles.css"), "utf8");
const required = [
  ["English document language", /<html lang="en">/],
  ["responsive viewport", /name="viewport"/],
  ["main landmark", /<main\b/],
  ["skip link", /class="skip" href="#main"/],
  ["visible keyboard focus", /:focus-visible/],
  ["narrow viewport layout", /@media\s*\(max-width:/],
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
if (!files.includes("arcshape-lockup.png"))
  throw new Error("Approved ArcShape lockup asset is missing");
if (files.some((file) => /product.?shape/i.test(file)))
  throw new Error(
    "ProductShape branded assets must not be used by ArcShape public site",
  );
if (!html.includes('alt="ArcShape — Architecture Documentation"'))
  throw new Error("Brand image needs descriptive alternative text");
console.log("Public-site source checks passed.");
