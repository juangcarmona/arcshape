import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  arc42Sections,
  architecture,
  repository,
  tagline,
} from "../src/data/site.mjs";

const dist = resolve(process.env.SITE_OUT_DIR ?? "dist");
const base = process.env.SITE_BASE ?? "/";
assert(
  base.startsWith("/") && base.endsWith("/"),
  "SITE_BASE must start and end with a slash",
);
for (const route of ["index.html", "arc42/index.html"]) {
  const html = await readFile(resolve(dist, route), "utf8");
  for (const pattern of [
    /<html lang="en"/,
    /name="viewport"/,
    /name="description"/,
    /<title>[^<]+<\/title>/,
    /<main\b/,
    /href="#main"/,
    /arcshape-appearance/,
    /data-lh-theme/,
    /<summary\b/,
  ])
    assert(pattern.test(html), `${route} is missing ${pattern}`);
  assert(
    html.includes(`href="${base}arc42/"`),
    `${route} must link to the arc42 guide`,
  );
  assert(html.includes(`href="${repository}"`), `${route} must link to GitHub`);
  assert(
    !/hreflang=|View site in|href="[^\"]*\/es\//.test(html),
    "The public site must be English only",
  );
  assert(
    html.includes(tagline) || html.includes(tagline.toUpperCase()),
    "The ArcShape tagline must be preserved",
  );
  const cssLinks = [...html.matchAll(/href="([^\"]+\.css)"/g)].map(
    (match) => match[1],
  );
  assert(cssLinks.length, "A bundled stylesheet is required");
  for (const href of cssLinks) {
    assert(href.startsWith(base), "Stylesheets must respect SITE_BASE");
    const css = await readFile(resolve(dist, href.slice(base.length)), "utf8");
    for (const pattern of [
      /--lh-canvas/,
      /--lh-action/,
      /:focus-visible/,
      /@media/,
      /prefers-reduced-motion/,
    ])
      assert(pattern.test(css), `The stylesheet is missing ${pattern}`);
  }
}
const home = await readFile(resolve(dist, "index.html"), "utf8");
assert(
  home.includes(`href="${architecture}"`),
  "The primary action must link to the architecture reader",
);
assert(
  home.includes("ArcShape is a local toolkit"),
  "The preview must contain a real source excerpt",
);
const guide = await readFile(resolve(dist, "arc42/index.html"), "utf8");
assert.equal(arc42Sections.length, 12);
for (const section of arc42Sections) {
  assert(
    guide.includes(`id="section-${section.number}"`),
    `Missing guide section ${section.number}`,
  );
  assert(
    guide.includes(`href="#section-${section.number}"`),
    `Missing anchor ${section.number}`,
  );
  assert(
    guide.includes(`href="${section.href}"`),
    `Missing official guidance ${section.number}`,
  );
  assert(
    section.purpose && section.example,
    `Section ${section.number} needs an explanation and example`,
  );
}
assert.equal(
  await readFile(resolve(dist, "_redirects"), "utf8"),
  `${base}es ${base} 301\n${base}es/ ${base} 301\n`,
);
await assert.rejects(
  access(resolve(dist, "es/index.html")),
  "The retired Spanish page must not be generated",
);
await access(resolve(dist, "assets/arcshape-lockup.webp"));
console.log(
  "English homepage, arc42 guide, Lighthouse styles, assets, and permanent redirects passed.",
);
