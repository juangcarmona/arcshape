/**
 * shell.mjs — build the single self-contained HTML page.
 *
 * Structure mirrors productshape's buildSnapshotHtml:
 *  - one inline <style> with light + dark design tokens;
 *  - one inert JSON data block;
 *  - one ES5 application script with a single hash router;
 *  - no external resources, no forms, nothing persisted outside the address.
 */
import { escapeHtml as esc } from "./render.mjs";
import { createHash } from "node:crypto";

/* ------------------------------------------------------------------ */
/* Design tokens: a calm engineering instrument in two appearances.   */
/* ------------------------------------------------------------------ */
const lightBlock = `  --bg: #ffffff;
  --panel: #f6f7f9;
  --raise: #ffffff;
  --ink: #12161d;
  --text: #1f2430;
  --muted: #4f5560;
  --line: #dfe3ea;
  --line-strong: #bfc6d1;
  --accent: #1c4fa3;
  --accent-soft: #e8eef8;
  --mark: #fff0b3;
  --code-bg: #f3f5f8;
  --edge: #47536b;`;

const darkBlock = `  --bg: #0f1216;
  --panel: #141920;
  --raise: #1a2029;
  --ink: #eef1f5;
  --text: #d4d9e1;
  --muted: #9aa3b2;
  --line: #262d37;
  --line-strong: #3a4350;
  --accent: #7aa7ff;
  --accent-soft: #1a2640;
  --mark: #5a4a12;
  --code-bg: #141920;
  --edge: #8e9ab0;
  --cat-quality: #f27ec2;
  --cat-views: #43c4da;
  --cat-concepts: #f79c50;
  --cat-other: #a9b2c5;`;

const lightBlockWithSectionColors = `${lightBlock}
  --cat-quality: #b0287a;
  --cat-views: #0b7285;
  --cat-concepts: #b54708;
  --cat-other: #56607a;`;

const SECTION_ICONS = [
  '<circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="8" r="2"/><path d="M8 1v2M15 8h-2M8 15v-2M1 8h2"/>',
  '<rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 0 1 6 0v2M8 10v1.5"/>',
  '<rect x="2" y="3" width="5" height="5" rx="1"/><rect x="9" y="8" width="5" height="5" rx="1"/><path d="M7 5.5h2v5H9"/>',
  '<circle cx="8" cy="8" r="6"/><path d="m10.7 5.3-1.4 3.6-4 1.8 1.8-4z"/>',
  '<path d="m2 5 6-3 6 3-6 3zM2 5v6l6 3 6-3V5M8 8v6"/>',
  '<circle cx="8" cy="8" r="6"/><path d="m7 5 4 3-4 3z"/>',
  '<rect x="3" y="2" width="10" height="5" rx="1"/><rect x="3" y="9" width="10" height="5" rx="1"/><path d="M5 4.5h.1M5 11.5h.1M8 7v2"/>',
  '<circle cx="6" cy="8" r="3"/><circle cx="10" cy="8" r="3"/>',
  '<path d="m8 1.5 6 3.4v6.2L8 14.5l-6-3.4V4.9zM8 5v4M8 11v.1"/>',
  '<path d="M2 12a6 6 0 1 1 12 0M8 10l3-4M4 12h8"/><circle cx="8" cy="10" r="1"/>',
  '<path d="m8 2 6 11H2zM8 6v3.5M8 11.5v.1"/>',
  '<path d="M3 2.5h7l3 3V14H3zM10 2.5V6h3M5 8h6M5 10h6M5 12h4"/>',
];

const SECTION_CODES = [
  "GOAL",
  "CON",
  "CTX",
  "STR",
  "BBV",
  "RUN",
  "DEP",
  "XCC",
  "ADR",
  "QR",
  "RTD",
  "GLO",
];

function sectionCategory(number) {
  const n = Number(number);
  if (n <= 3 || n === 10) return "quality";
  if (n >= 5 && n <= 7) return "views";
  if (n >= 4 && n <= 9) return "concepts";
  return "other";
}

function sectionIcon(number) {
  const index = Number(number) - 1;
  return `<svg viewBox="0 0 16 16" aria-hidden="true">${SECTION_ICONS[index] ?? SECTION_ICONS[11]}</svg>`;
}

const ACRONYMS = new Set(["api", "sql", "adr", "ui", "url", "http", "id"]);

export function humanizeSegment(segment) {
  return String(segment)
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      return ACRONYMS.has(lower)
        ? lower.toUpperCase()
        : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function sortNavigationNodes(nodes) {
  nodes.sort((left, right) => {
    const leftFolder = left.kind === "folder";
    const rightFolder = right.kind === "folder";
    if (leftFolder !== rightFolder) return leftFolder ? 1 : -1;
    const leftLabel = leftFolder
      ? left.label
      : left.document.title || left.document.relativeFile;
    const rightLabel = rightFolder
      ? right.label
      : right.document.title || right.document.relativeFile;
    return leftLabel.localeCompare(rightLabel, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
  for (const node of nodes) {
    if (node.kind === "folder") sortNavigationNodes(node.children);
  }
  return nodes;
}

export function buildNavigationTree(supporting = []) {
  const root = { kind: "root", children: [] };
  const folders = new Map();
  for (const document of supporting) {
    const relativeFile = String(document.relativeFile || "").replaceAll(
      "\\",
      "/",
    );
    const parts = relativeFile.split("/").filter(Boolean);
    if (parts.length < 2) {
      root.children.push({ kind: "page", document });
      continue;
    }

    let parent = root;
    const path = [];
    for (const segment of parts.slice(0, -1)) {
      path.push(segment);
      const folderPath = path.join("/");
      let folder = folders.get(folderPath);
      if (!folder) {
        folder = {
          kind: "folder",
          path: folderPath,
          label: humanizeSegment(segment),
          page: undefined,
          children: [],
        };
        folders.set(folderPath, folder);
        parent.children.push(folder);
      }
      parent = folder;
    }

    if (parts.at(-1).toLowerCase() === "readme.md") {
      parent.page = document;
      parent.label = document.title || parent.label;
    } else {
      parent.children.push({ kind: "page", document });
    }
  }
  sortNavigationNodes(root.children);
  return root.children;
}

function navigationBreadcrumbs(supporting) {
  const folderPages = new Map();
  for (const document of supporting) {
    const relativeFile = String(document.relativeFile || "").replaceAll(
      "\\",
      "/",
    );
    if (!relativeFile.toLowerCase().endsWith("/readme.md")) continue;
    folderPages.set(
      relativeFile.slice(0, -"/README.md".length).toLowerCase(),
      document,
    );
  }

  return supporting.map((document) => {
    const relativeFile = String(document.relativeFile || "").replaceAll(
      "\\",
      "/",
    );
    const parts = relativeFile.split("/").filter(Boolean);
    const folders = parts.slice(0, -1);
    const breadcrumbs = [];
    for (let i = 0; i < folders.length; i += 1) {
      const path = folders.slice(0, i + 1).join("/");
      const page = folderPages.get(path.toLowerCase());
      breadcrumbs.push({
        label: page?.title || humanizeSegment(folders[i]),
        route: page?.route,
      });
    }
    return { ...document, breadcrumbs };
  });
}

const style = `
:root {
${lightBlockWithSectionColors}
  --sans: system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, 'SF Mono', 'Cascadia Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-appearance='light']) {
${darkBlock}
    color-scheme: dark;
  }
  :root:not([data-appearance='light']) .brand-logo-light { display:none; }
  :root:not([data-appearance='light']) .brand-logo-dark { display:block; }
}
:root[data-appearance='dark'] {
${darkBlock}
  color-scheme: dark;
}
:root[data-appearance='dark'] .brand-logo-light { display:none; }
:root[data-appearance='dark'] .brand-logo-dark { display:block; }
* { box-sizing: border-box; }
[hidden] { display: none !important; }
html, body { height: 100%; }
body {
  margin: 0; display: flex; flex-direction: column; overflow: hidden;
  font: 14px/1.5 var(--sans); color: var(--text); background: var(--bg);
  -webkit-text-size-adjust: 100%;
}
h1, h2, h3, h4, h5, h6 { color: var(--ink); line-height: 1.3; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
button { font: inherit; color: inherit; }
code, kbd, .rev { font-family: var(--mono); font-size: 0.88em; }
code { background: var(--code-bg); border: 1px solid var(--line); border-radius: 3px; padding: 0.05em 0.35em; }
pre { background: var(--panel); border: 1px solid var(--line); border-radius: 4px; padding: 0.6rem 0.8rem; overflow-x: auto; font-size: 0.85rem; line-height: 1.5; }
pre code { background: none; border: none; padding: 0; font-size: inherit; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.skip {
  position: absolute; left: -9999px; top: 0; z-index: 20;
  background: var(--raise); color: var(--ink); padding: 0.4rem 0.8rem;
  border: 1px solid var(--line-strong);
}
.skip:focus { left: 0.5rem; top: 0.5rem; }
.visually-hidden { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }

/* ---- Header ---- */
header.site {
  flex: none; border-bottom: 1px solid var(--line);
  background: var(--raise);
}
.header-inner { width:min(1160px,calc(100% - 2.5rem)); min-height:52px; margin:auto; display:flex; align-items:center; gap:.65rem; }
header.site h1 { display:flex; align-items:center; gap:.5rem; margin:0; min-width:0; font-size:.95rem; white-space:nowrap; }
.brand-mark { display:grid; place-items:center; flex:none; width:1.75rem; height:1.75rem; color:var(--accent); }
.brand-mark svg { display:block; width:100%; height:100%; }
.brand-logo-dark { display:none; filter:invert(1) hue-rotate(180deg); mix-blend-mode:screen; }
.brand-title { color:var(--ink); font-size:.96rem; font-weight:650; letter-spacing:-.025em; }
.brand-caption { color:var(--muted); font-size:.72rem; white-space:nowrap; }
.project-context { min-width:0; overflow:hidden; color:var(--muted); font-size:.82rem; text-overflow:ellipsis; white-space:nowrap; }
.revshort {
  font-family: var(--mono); font-size: 0.74rem; color: var(--muted);
  border: 1px solid var(--line); border-radius: 3px; padding: 0.12rem 0.4rem; white-space: nowrap;
}
.primary-nav { display:flex; align-self:stretch; align-items:stretch; gap:.25rem; margin-left:.5rem; }
.primary-nav a { display:inline-flex; align-items:center; padding:.25rem .6rem; border-bottom:2px solid transparent; color:var(--muted); font-size:.9rem; }
.primary-nav a:hover { color:var(--ink); text-decoration:none; background:var(--panel); }
.primary-nav a[aria-current='page'] { color:var(--ink); border-bottom-color:var(--accent); background:var(--accent-soft); }
header.site .spacer { flex: 1; }
.iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  flex: none;
  width: 2rem; height: 2rem; border: 1px solid var(--line-strong); border-radius: 4px;
  background: var(--raise); cursor: pointer; color: var(--muted);
}
.iconbtn svg { width:1rem; height:1rem; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
.iconbtn:hover { color: var(--ink); border-color: var(--accent); }
.appearance { display: inline-flex; flex: none; border: 1px solid var(--line-strong); border-radius: 4px; overflow: hidden; }
.appearance button {
  display: inline-flex; align-items: center; justify-content: center; min-width: 2.2rem; min-height: 2.2rem;
  border: none; background: var(--raise); color: var(--muted); cursor: pointer; font-size: 1rem;
}
.appearance button + button { border-left: 1px solid var(--line); }
.appearance button[aria-pressed='true'] { background: var(--accent-soft); color: var(--ink); }

/* ---- Layout ---- */
#shell { flex: 1 1 auto; min-height: 0; display: flex; }
aside.nav {
  position:relative; flex:none; width:24rem; overflow-y:auto; border-right:1px solid var(--line);
  background: var(--panel); padding: 0.9rem 0.75rem;
  transition:width .18s ease,padding .18s ease;
}
main#main { flex: 1 1 auto; min-width: 0; overflow-y: auto; padding: 1.4rem 2.2rem 4rem; scroll-behavior: smooth; }
.doc { max-width: 78ch; margin: 0 auto; }
.doc > h2.doc-title { margin: 0 0 0.2rem; font-size: 1.45rem; }
p.doc-desc { margin: 0 0 1.2rem; color: var(--muted); font-size: 0.9rem; }
p.doc-owner { margin: 0 0 .7rem; color: var(--muted); font-size: .82rem; }
.breadcrumbs { margin:0 0 .7rem; color:var(--muted); font-size:.8rem; }
.breadcrumbs ol { display:flex; flex-wrap:wrap; gap:.2rem .45rem; list-style:none; margin:0; padding:0; }
.breadcrumbs li { display:inline-flex; align-items:center; gap:.45rem; }
.breadcrumbs li:not(:last-child)::after { content:'›'; color:var(--line-strong); }
.breadcrumbs a { color:var(--accent); }
.breadcrumbs [aria-current='page'] { color:var(--ink); }

/* ---- Sidebar ---- */
aside.nav .nav-heading { display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin:0 0 .5rem; }
aside.nav h2 { margin:0; font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); }
aside.nav ol { list-style: none; margin: 0; padding: 0; }
aside.nav li { margin: 0; border-bottom: 1px solid var(--line); }
aside.nav a {
  display:flex; min-height:3.25rem; gap:.5rem; align-items:center; padding:.5rem .4rem;
  color: var(--text); border-left: 2px solid transparent;
}
aside.nav a:hover { color: var(--ink); text-decoration: none; background: var(--raise); }
aside.nav a[aria-current='page'] { color: var(--ink); border-left-color: var(--accent); background: var(--raise); }
aside.nav .nav-kind { display:inline-flex; flex:none; align-items:center; gap:.25rem; min-width:3.9rem; padding:.1rem .3rem; border:1px solid color-mix(in srgb,var(--category) 68%,var(--line)); border-radius:4px; color:var(--category); }
aside.nav .nav-icon { display:inline-flex; flex:none; width:1rem; height:1rem; }
aside.nav .nav-chevron { display:inline-flex; flex:none; width:.75rem; height:.75rem; color:var(--accent); }
aside.nav .nav-icon svg, aside.nav .nav-chevron svg, .prevnext svg { width:100%; height:100%; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
aside.nav a[data-category="quality"], .prevnext a[data-category="quality"] { --category:var(--cat-quality); }
aside.nav a[data-category="views"], .prevnext a[data-category="views"] { --category:var(--cat-views); }
aside.nav a[data-category="concepts"], .prevnext a[data-category="concepts"] { --category:var(--cat-concepts); }
aside.nav a[data-category="other"], .prevnext a[data-category="other"] { --category:var(--cat-other); }
aside.nav .nav-code { display:inline-flex; flex:none; font:600 .75rem/1.2 var(--mono); color:inherit; }
aside.nav .t { flex:1 1 auto; min-width:0; font-size:.95rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
aside.nav .nav-number { flex:none; color:var(--muted); font: .68rem/1 var(--mono); }
aside.nav .supporting-nav { list-style:none; margin:0 0 .35rem 2.1rem; padding:0; }
aside.nav .supporting-nav li { border:0; }
aside.nav .supporting-nav a { min-height:2rem; padding:.3rem .4rem; border-left-width:1px; font-size:.82rem; color:var(--muted); }
aside.nav .supporting-nav a::before { content:'↳'; margin-right:.35rem; color:var(--accent); }
aside.nav .supporting-tree { margin-left:1.45rem; }
aside.nav .supporting-tree li { border:0; }
aside.nav .nav-folder-row { display:flex; align-items:stretch; min-width:0; }
aside.nav .nav-folder-row > a { flex:1 1 auto; min-width:0; }
aside.nav .nav-folder-toggle {
  display:inline-flex; flex:none; align-items:center; justify-content:center; width:1.5rem;
  border:0; padding:0; background:transparent; color:var(--muted); cursor:pointer;
}
aside.nav .nav-folder-toggle:hover { color:var(--ink); background:var(--raise); }
aside.nav .nav-folder-toggle svg { width:.75rem; height:.75rem; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; transition:transform .15s ease; }
aside.nav .nav-folder-toggle[aria-expanded='true'] svg { transform:rotate(90deg); }
aside.nav .nav-folder > .supporting-nav { margin:.1rem 0 .25rem 1.35rem; padding-left:.55rem; border-left:1px solid var(--line-strong); }
aside.nav .supporting-tree .t { white-space:normal; overflow:visible; text-overflow:clip; overflow-wrap:anywhere; }
aside.nav .supporting-tree a::before { content:'↳'; margin-right:.35rem; color:var(--accent); }
.nav-foot { margin-top: 1rem; padding-top: 0.6rem; border-top: 1px solid var(--line); font-size: 0.78rem; color: var(--muted); }
.nav-foot .prevnext { display: flex; justify-content: space-between; gap: 0.5rem; }
.nav-foot .prevnext a { font-size: 0.78rem; }
.prevnext a { display:flex; align-items:flex-start; gap:.35rem; max-width:48%; color:var(--category); }
.prevnext .nav-icon { display:inline-flex; width:.9rem; height:.9rem; flex:none; margin-top:.15rem; }
body.nav-collapsed aside.nav { width:4.25rem; padding:.9rem .55rem; }
body.nav-collapsed aside.nav .nav-heading { justify-content:center; }
body.nav-collapsed aside.nav h2, body.nav-collapsed aside.nav .nav-title, body.nav-collapsed aside.nav .nav-foot, body.nav-collapsed aside.nav .supporting-nav, body.nav-collapsed aside.nav .supporting-tree { display:none; }
body.nav-collapsed aside.nav a { flex-direction:column; gap:.2rem; align-items:center; padding:.5rem .15rem; }
body.nav-collapsed aside.nav .nav-kind { flex-direction:column; gap:.15rem; min-width:0; padding:.2rem; }
body.nav-collapsed aside.nav .nav-icon { width:1.2rem; height:1.2rem; }
body.nav-collapsed aside.nav .nav-chevron, body.nav-collapsed aside.nav .nav-number { display:none; }
body.nav-collapsed aside.nav .nav-code { display:block; }
.mobile-nav-toggle, #nav-close, #nav-backdrop { display:none; }

/* ---- Content ---- */
.doc h3 { margin: 1.6rem 0 0.5rem; font-size: 1.12rem; border-bottom: 1px solid var(--line); padding-bottom: 0.25rem; }
.doc h4 { margin: 1.35rem 0 0.35rem; font-size: 1rem; }
.doc h5 { margin: 1.1rem 0 0.3rem; font-size: 0.9rem; }
.doc h6 { margin: 1rem 0 0.3rem; font-size: 0.85rem; }
.doc p, .doc ul, .doc ol { margin: 0.55rem 0; }
.doc ul, .doc ol { padding-left: 1.4rem; }
.doc li { margin: 0.18rem 0; }
.doc table { border-collapse: collapse; margin: 0.8rem 0; font-size: 0.88rem; display: block; overflow-x: auto; max-width: 100%; }
.doc th, .doc td { border: 1px solid var(--line); padding: 0.32rem 0.6rem; text-align: left; vertical-align: top; }
.doc th { background: var(--panel); color: var(--ink); }
.doc blockquote { margin: 0.6rem 0; padding: 0.15rem 0.9rem; border-left: 3px solid var(--line-strong); color: var(--muted); }
.doc hr { border: none; border-top: 1px solid var(--line); margin: 1.4rem 0; }
.xref-dead code { word-break: break-all; }
figure.diagram {
  margin: 1rem 0; padding: 0.85rem; border: 1px solid var(--line); border-radius: 6px;
  background: #ffffff; color: #183b56; overflow-x: auto; overscroll-behavior-x: contain;
}
figure.diagram figcaption {
  display: flex; flex-wrap: wrap; gap: 0.25rem 1rem; align-items: baseline;
  margin: 0 0 0.7rem; padding-bottom: 0.55rem; border-bottom: 1px solid #dfe5ee;
  color: #46566e; font-size: 0.76rem; line-height: 1.5;
}
figure.diagram figcaption a { color: #2854d7; text-decoration: underline; text-underline-offset: 0.12em; }
.diagram-title { color: #17243a; font-weight: 700; }
.diagram-renderer { font-weight: 650; }
figure.diagram svg { display: block; width: auto; max-width: min(100%, 72rem); height: auto; margin-inline: auto; }
.diagram-missing { color: var(--muted); font-style: italic; }
mark { background: var(--mark); color: inherit; border-radius: 2px; padding: 0 0.05em; }

/* ---- Search dialog ---- */
.dlg { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: flex-start; justify-content: center; padding-top: 12vh; z-index: 30; }
.dlgbox {
  width: min(38rem, 92vw); background: var(--raise); border: 1px solid var(--line-strong);
  border-radius: 6px; box-shadow: 0 12px 40px rgba(0,0,0,0.25); overflow: hidden;
}
.dlgbox input {
  width: 100%; border: none; border-bottom: 1px solid var(--line); padding: 0.7rem 0.9rem;
  font: inherit; color: var(--ink); background: var(--raise); outline: none;
}
.dlgbox ul { list-style: none; margin: 0; padding: 0; max-height: 50vh; overflow-y: auto; }
.dlgbox li a { display: block; padding: 0.45rem 0.9rem; color: var(--text); border-left: 2px solid transparent; }
.dlgbox li a:hover, .dlgbox li a.sel { background: var(--accent-soft); color: var(--ink); border-left-color: var(--accent); text-decoration: none; }
.dlgbox .where { display: block; font-size: 0.76rem; color: var(--muted); }
.dlgbox .empty { padding: 0.7rem 0.9rem; color: var(--muted); font-size: 0.88rem; }
kbd {
  border: 1px solid var(--line-strong); border-bottom-width: 2px; border-radius: 3px;
  padding: 0 0.3em; font-size: 0.8em; background: var(--raise); color: var(--muted);
}

/* ---- Keyboard help ---- */
.keysbox { width: min(28rem, 92vw); }
.keysbox dl { margin: 0; padding: 0.6rem 0.9rem 0.9rem; }
.keysbox dt { font-weight: 650; color: var(--ink); margin-top: 0.55rem; }
.keysbox dd { margin: 0.1rem 0 0; color: var(--muted); font-size: 0.88rem; }

/* ---- Toast ---- */
.toast {
  position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);
  background: var(--raise); border: 1px solid var(--line-strong); border-radius: 4px;
  padding: 0.35rem 0.8rem; font-size: 0.85rem; color: var(--ink); z-index: 40;
  opacity: 0; transition: opacity 0.15s; pointer-events: none;
}
.toast.show { opacity: 1; }

/* ---- Narrow viewports ---- */
@media (max-width: 900px) {
  header.site .mobile-nav-toggle { display:inline-flex; }
  #shell { position:relative; }
  aside.nav { position:absolute; z-index:25; inset:0 auto 0 0; width:min(24rem,86vw); transform:translateX(-105%); transition:transform .2s ease; box-shadow:0 12px 36px rgba(0,0,0,.28); }
  body.mobile-nav-open aside.nav { transform:translateX(0); }
  #nav-close { display:inline-flex; }
  #nav-backdrop { position:absolute; z-index:24; inset:0; display:block; border:0; background:rgba(0,0,0,.48); }
  body.nav-collapsed aside.nav { width:min(24rem,86vw); padding:.9rem .75rem; }
  body.nav-collapsed aside.nav .nav-heading { justify-content:space-between; }
  body.nav-collapsed aside.nav h2, body.nav-collapsed aside.nav .nav-title, body.nav-collapsed aside.nav .nav-foot { display:block; }
  body.nav-collapsed aside.nav a { flex-direction:row; gap:.5rem; align-items:center; padding:.5rem .4rem; }
  body.nav-collapsed aside.nav .nav-kind { flex-direction:row; gap:.25rem; min-width:3.9rem; padding:.1rem .3rem; }
  body.nav-collapsed aside.nav .nav-icon { width:1rem; height:1rem; }
  body.nav-collapsed aside.nav .nav-chevron { display:inline-flex; }
  body.nav-collapsed aside.nav .nav-number { display:inline; }
  body.nav-collapsed aside.nav .nav-code { display:none; }
  main#main { padding:1rem 1rem 3rem; }
}
@media (max-width: 520px) {
  .header-inner { width:calc(100% - 1.5rem); flex-wrap:wrap; gap:.5rem; padding:.5rem 0; }
  header.site h1 { flex:none; }
  header.site .project-context { order:5; flex:1 0 calc(100% - 2.25rem); margin-left:2.25rem; }
  header.site .spacer { display:none; }
  header.site .appearance { margin-left:auto; }
  header.site .primary-nav { order:6; flex:1 0 100%; overflow-x:auto; margin:0; border-top:1px solid var(--line); }
  header.site .primary-nav a { min-height:2.5rem; }
}
.overview-intro { max-width:72.5rem; margin:0 auto .5rem; }
.overview-intro h2 { margin:0 0 .25rem; font-size:1.1rem; }
.overview-intro p { margin:0; color:var(--muted); font-size:.85rem; }
.section-cards { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.5rem; max-width:72.5rem; margin:auto; }
.section-card { display:flex; align-items:flex-start; gap:1rem; min-height:7.5rem; padding:1rem 1.125rem; color:var(--ink); border:1px solid color-mix(in srgb,var(--category) 48%,var(--line)); border-radius:5px; background:color-mix(in srgb,var(--category) 9%,var(--raise)); }
.section-card:hover { border-color:var(--category); text-decoration:none; }
.section-card[data-category="quality"] { --category:var(--cat-quality); }
.section-card[data-category="views"] { --category:var(--cat-views); }
.section-card[data-category="concepts"] { --category:var(--cat-concepts); }
.section-card[data-category="other"] { --category:var(--cat-other); }
.section-card .section-icon { display:inline-flex; flex:none; align-items:center; justify-content:center; width:2.625rem; height:2.625rem; margin-top:.1rem; border:1px solid color-mix(in srgb,var(--category) 42%,var(--line)); border-radius:50%; background:color-mix(in srgb,var(--category) 10%,var(--raise)); color:var(--category); }
.section-card .section-icon svg { width:1.25rem; height:1.25rem; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
.section-card .section-copy { flex:1 1 auto; min-width:0; }
.section-card .section-meta { display:block; margin:0 0 .2rem; color:var(--category); font:600 .75rem/1.4 var(--mono); letter-spacing:.04em; }
.section-card strong { display:block; color:var(--ink); font-size:1.1rem; line-height:1.35; }
.section-card small { display:block; margin-top:.25rem; color:var(--muted); font-size:.95rem; }
.section-legend { display:flex; flex-wrap:wrap; gap:.5rem 1rem; max-width:72.5rem; margin:.5rem auto 0; padding-top:.5rem; border-top:1px solid var(--line); color:var(--muted); font-size:.9rem; }
.section-legend span { display:inline-flex; align-items:center; gap:.4rem; }
.section-legend i { width:.8rem; height:.8rem; border-radius:50%; background:var(--category); }
.section-legend [data-category="quality"] { --category:var(--cat-quality); }
.section-legend [data-category="views"] { --category:var(--cat-views); }
.section-legend [data-category="concepts"] { --category:var(--cat-concepts); }
.section-legend [data-category="other"] { --category:var(--cat-other); }
@media(max-width:650px) { .section-cards { grid-template-columns:1fr; } }
@media print {
  body { overflow: visible; }
  aside.nav, header.site .appearance, header.site .iconbtn { display: none; }
  main#main { overflow: visible; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
}
`.trim();

/* ------------------------------------------------------------------ */
/* The application: one router, views rendered from inert data.        */
/* ------------------------------------------------------------------ */
const script = String.raw`
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var dataEl = doc.getElementById('arc42-data');
  if (!dataEl) return;
  var DATA = JSON.parse(dataEl.textContent || '{}');
  var README = DATA.readme || {};
  var SECTIONS = DATA.sections || [];
  var byNumber = {};
  for (var i = 0; i < SECTIONS.length; i += 1) byNumber[SECTIONS[i].number] = SECTIONS[i];

  var el = function (tag, cls, text) {
    var node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  var clear = function (node) { while (node.firstChild) node.removeChild(node.firstChild); };

  /* ---------- Search index (built lazily, offline) ---------- */
  var index = null;
  function buildIndex() {
    index = [];
    var push = function (number, route, where, text) {
      var plain = text.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
      index.push({ number: number, route: route, where: where, text: plain });
    };
    push('', '#/', 'Overview', (README.title || '') + ' ' + (README.html || ''));
    for (var i = 0; i < SECTIONS.length; i += 1) {
      var s = SECTIONS[i];
      push(s.number, '#/section/' + s.number, s.title, s.title + ' ' + s.description + ' ' + (s.html || ''));
      for (var d = 0; d < (s.supporting || []).length; d += 1) {
        var supporting = s.supporting[d];
        push(s.number, supporting.route, supporting.title, supporting.title + ' ' + (supporting.description || '') + ' ' + (supporting.html || ''));
      }
    }
  }
  function search(query) {
    if (!index) buildIndex();
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    var results = [];
    for (var i = 0; i < index.length; i += 1) {
      var entry = index[i];
      var hay = entry.text.toLowerCase();
      var score = 0;
      var all = true;
      for (var t = 0; t < terms.length; t += 1) {
        var term = terms[t];
        var inTitle = entry.where.toLowerCase().indexOf(term) !== -1;
        var hits = hay.split(term).length - 1;
        if (hits === 0 && !inTitle) { all = false; break; }
        score += inTitle ? 12 : 0;
        score += Math.min(hits, 8);
      }
      if (all) results.push({ score: score, entry: entry });
    }
    results.sort(function (a, b) { return b.score - a.score || (a.entry.number < b.entry.number ? -1 : 1); });
    return results.slice(0, 24);
  }

  /* ---------- Views ---------- */
  function renderBreadcrumbs(article, owner, document) {
    if (!document || !document.breadcrumbs || document.breadcrumbs.length === 0) return;
    var nav = el('nav', 'breadcrumbs');
    nav.setAttribute('aria-label', 'Breadcrumb');
    var list = el('ol');
    var sectionItem = el('li');
    var sectionLink = doc.createElement('a');
    sectionLink.href = '#/section/' + owner.number;
    sectionLink.textContent = owner.title;
    sectionItem.appendChild(sectionLink);
    list.appendChild(sectionItem);
    for (var i = 0; i < document.breadcrumbs.length; i += 1) {
      var breadcrumb = document.breadcrumbs[i];
      var item = el('li');
      if (breadcrumb.route) {
        var link = doc.createElement('a');
        link.href = breadcrumb.route;
        link.textContent = breadcrumb.label;
        item.appendChild(link);
      } else item.appendChild(el('span', null, breadcrumb.label));
      list.appendChild(item);
    }
    var current = el('li');
    current.setAttribute('aria-current', 'page');
    current.appendChild(el('span', null, document.title));
    list.appendChild(current);
    nav.appendChild(list);
    article.insertBefore(nav, article.firstChild);
  }

  function renderDoc(host, title, description, html, owner, document) {
    clear(host);
    var article = el('article', 'doc');
    var h = el('h2', 'doc-title', title);
    article.appendChild(h);
    if (owner) {
      var ownerLine = el('p', 'doc-owner');
      ownerLine.appendChild(doc.createTextNode('Supporting material for '));
      var ownerLink = doc.createElement('a');
      ownerLink.href = '#/section/' + owner.number;
      ownerLink.textContent = owner.title;
      ownerLine.appendChild(ownerLink);
      article.appendChild(ownerLine);
      renderBreadcrumbs(article, owner, document);
    }
    if (description) article.appendChild(el('p', 'doc-desc', description));
    var body = el('div', 'doc-body');
    body.innerHTML = html; /* generator-escaped markdown output only */
    article.appendChild(body);
    host.appendChild(article);
    doc.getElementById('main').scrollTop = 0;
  }

  function showOverview(host) {
    clear(host);
    host.appendChild(el('h2', 'visually-hidden', README.title || 'Architecture Documentation'));
    var cards = el('div', 'section-cards');
    for (var i = 0; i < SECTIONS.length; i += 1) {
      var section = SECTIONS[i];
      var card = doc.createElement('a');
      card.className = 'section-card';
      card.href = '#/section/' + section.number;
      card.setAttribute('data-category', section.category);
      var icon = el('span', 'section-icon');
      icon.innerHTML = section.icon;
      card.appendChild(icon);
      var copy = el('span', 'section-copy');
      copy.appendChild(el('span', 'section-meta', section.code + ' · ' + String(Number(section.number)).padStart(2, '0')));
      copy.appendChild(el('strong', null, section.title));
      copy.appendChild(el('small', null, section.description || 'Explore this architecture section.'));
      card.appendChild(copy);
      cards.appendChild(card);
    }
    host.appendChild(cards);
    var legend = el('div', 'section-legend');
    legend.setAttribute('role', 'group');
    legend.setAttribute('aria-label', 'Section color families');
    [
      ['quality', 'Requirements & quality'],
      ['views', 'Structures & views'],
      ['concepts', 'Concepts, technologies, decisions'],
      ['other', 'Risks & reference'],
    ].forEach(function (family) {
      var label = el('span');
      label.setAttribute('data-category', family[0]);
      var swatch = el('i');
      swatch.setAttribute('aria-hidden', 'true');
      label.appendChild(swatch);
      label.appendChild(doc.createTextNode(family[1]));
      legend.appendChild(label);
    });
    host.appendChild(legend);
  }

  function findSupporting(section, route) {
    if (!section) return null;
    var documents = section.supporting || [];
    for (var i = 0; i < documents.length; i += 1) {
      var document = documents[i];
      if (route === document.route) return { document: document, anchor: '' };
    }
    var candidates = documents.slice().sort(function (left, right) {
      return right.route.length - left.route.length;
    });
    for (var j = 0; j < candidates.length; j += 1) {
      var candidate = candidates[j];
      var prefix = candidate.route + '/';
      if (route.indexOf(prefix) === 0)
        return { document: candidate, anchor: route.slice(prefix.length) };
    }
    return null;
  }

  function showSection(host, number, supportingMatch) {
    var section = byNumber[number];
    if (!section) {
      clear(host);
      var box = el('div', 'doc');
      box.appendChild(el('h2', 'doc-title', 'Section not found'));
      var p = el('p');
      p.appendChild(doc.createTextNode('This snapshot does not contain section ' + number + '.'));
      box.appendChild(p);
      var ways = el('p');
      var home = doc.createElement('a');
      home.href = '#/';
      home.textContent = 'Open the overview';
      ways.appendChild(home);
      ways.appendChild(doc.createTextNode(' or '));
      var list = doc.createElement('a');
      list.href = '#/section/' + (SECTIONS[0] ? SECTIONS[0].number : '01');
      list.textContent = 'start at the first section';
      ways.appendChild(list);
      ways.appendChild(doc.createTextNode('.'));
      box.appendChild(ways);
      host.appendChild(box);
      return;
    }
    if (supportingMatch) {
      var document = supportingMatch.document;
      renderDoc(host, document.title, document.description, document.html || '', section, document);
    } else renderDoc(host, section.title, section.description, section.html || '');
  }

  /* ---------- Sidebar state ---------- */
  function setFolderOpen(folder, expanded) {
    var toggle = folder.querySelector('[data-folder-toggle]');
    var children = toggle ? doc.getElementById(toggle.getAttribute('aria-controls')) : null;
    if (!toggle || !children) return;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', (expanded ? 'Collapse ' : 'Expand ') + (folder.getAttribute('data-folder-label') || 'folder'));
    children.hidden = !expanded;
  }

  function openAncestorFolders(document) {
    if (!document || !document.relativeFile) return;
    var parts = document.relativeFile.split('/');
    var folders = parts.slice(0, -1);
    var nodes = doc.querySelectorAll('.nav-folder[data-folder-path]');
    for (var i = 0; i < nodes.length; i += 1) {
      var path = nodes[i].getAttribute('data-folder-path');
      var ancestor = false;
      for (var j = 0; j < folders.length; j += 1) {
        if (folders.slice(0, j + 1).join('/') === path) { ancestor = true; break; }
      }
      if (ancestor) setFolderOpen(nodes[i], true);
    }
  }

  function syncNav(route, supportingDocument) {
    var links = doc.querySelectorAll('aside.nav a[data-route]');
    for (var i = 0; i < links.length; i += 1) {
      var current = links[i].getAttribute('data-route') === route;
      if (current) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
    var tabs = doc.querySelectorAll('.primary-nav a[data-route]');
    for (var t = 0; t < tabs.length; t += 1) {
      if (tabs[t].getAttribute('data-route') === route) tabs[t].setAttribute('aria-current', 'page');
      else tabs[t].removeAttribute('aria-current');
    }
    var m = /^#\/section\/(\d+)/.exec(route);
    var number = m ? m[1] : null;
    var prev = doc.getElementById('nav-prev');
    var next = doc.getElementById('nav-next');
    var set = function (a, target, direction) {
      clear(a);
      if (!target) { a.style.visibility = 'hidden'; return; }
      a.style.visibility = 'visible';
      a.href = '#/section/' + target.number;
      a.setAttribute('data-category', target.category);
      var icon = el('span', 'nav-icon');
      icon.innerHTML = direction === 'previous'
        ? '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3-5 5 5 5"/></svg>'
        : '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>';
      a.appendChild(icon);
      a.appendChild(el('span', null, target.title));
    };
    if (number) {
      var pos = -1;
      for (var s = 0; s < SECTIONS.length; s += 1) if (SECTIONS[s].number === number) pos = s;
      set(prev, pos > 0 ? SECTIONS[pos - 1] : null, 'previous');
      set(next, pos >= 0 && pos < SECTIONS.length - 1 ? SECTIONS[pos + 1] : null, 'next');
    } else {
      set(prev, null); set(next, null);
    }
    openAncestorFolders(supportingDocument);
  }

  /* ---------- Router ---------- */
  function go() {
    var hash = location.hash || '#/';
    var host = doc.getElementById('content');
    var route = hash.split('?')[0];
    var m = /^#\/section\/(\d{2})(?:\/(.*))?$/.exec(route);
    var supportingMatch = m ? findSupporting(byNumber[m[1]], route) : null;
    if (m) showSection(host, m[1], supportingMatch);
    else showOverview(host);
    syncNav(m ? (supportingMatch ? supportingMatch.document.route : '#/section/' + m[1]) : '#/', supportingMatch ? supportingMatch.document : null);
    var anchor = supportingMatch ? supportingMatch.anchor : m ? m[2] || '' : /^#\/([^/]*)$/.exec(route);
    if (!m) anchor = anchor ? anchor[1] : '';
    if (anchor) {
      try {
        var heading = doc.getElementById(decodeURIComponent(anchor));
        if (heading && host.contains(heading)) heading.scrollIntoView({ block: 'start' });
      } catch (error) { /* malformed anchors leave the document at its start */ }
    }
  }

  /* ---------- Appearance: carried in the address only ---------- */
  function applyAppearance() {
    var m = /[?&]a=(light|dark)/.exec(location.hash);
    var choice = m ? m[1] : 'auto';
    if (choice !== 'auto') root.setAttribute('data-appearance', choice);
    else root.removeAttribute('data-appearance');
    var buttons = doc.querySelectorAll('.appearance button');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-appearance-set') === choice));
    }
  }
  function setAppearance(choice) {
    var hash = (location.hash || '#/').split('?')[0];
    var next = choice === 'auto' ? hash : hash + (hash.indexOf('?') === -1 ? '?' : '&') + 'a=' + choice;
    location.hash = next;
  }

  /* ---------- Search dialog ---------- */
  var findState = { sel: 0, results: [] };
  function openFind() {
    var dlg = doc.getElementById('find');
    var input = doc.getElementById('find-input');
    dlg.hidden = false;
    input.value = '';
    runSearch('');
    input.focus();
  }
  function closeFind() {
    doc.getElementById('find').hidden = true;
    doc.getElementById('ov-find').focus();
  }
  function runSearch(query) {
    var list = doc.getElementById('find-results');
    clear(list);
    findState.results = search(query);
    findState.sel = 0;
    if (query.trim() === '') {
      var li = el('li');
      li.appendChild(el('div', 'empty', 'Type to search across the overview and all ' + SECTIONS.length + ' sections.'));
      list.appendChild(li);
      return;
    }
    if (findState.results.length === 0) {
      var li2 = el('li');
      li2.appendChild(el('div', 'empty', 'No matches.'));
      list.appendChild(li2);
      return;
    }
    for (var i = 0; i < findState.results.length; i += 1) {
      var r = findState.results[i].entry;
      var a = doc.createElement('a');
      a.href = r.route;
      a.addEventListener('click', closeFind);
      var where = el('span', null, r.where);
      a.appendChild(where);
      a.appendChild(el('span', 'where', r.number ? 'section ' + r.number : 'overview'));
      list.appendChild(a);
    }
    var first = list.querySelector('a');
    if (first) first.classList.add('sel');
  }
  function moveSel(delta) {
    var links = doc.querySelectorAll('#find-results a');
    if (links.length === 0) return;
    links[findState.sel].classList.remove('sel');
    findState.sel = Math.min(Math.max(findState.sel + delta, 0), links.length - 1);
    links[findState.sel].classList.add('sel');
    links[findState.sel].scrollIntoView({ block: 'nearest' });
  }

  /* ---------- Keyboard shortcuts ---------- */
  function shortcuts(event) {
    if (event.defaultPrevented) return;
    var target = event.target;
    var typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    var findOpen = !doc.getElementById('find').hidden;
    if (findOpen) {
      if (event.key === 'Escape') { closeFind(); event.preventDefault(); }
      else if (event.key === 'ArrowDown') { moveSel(1); event.preventDefault(); }
      else if (event.key === 'ArrowUp') { moveSel(-1); event.preventDefault(); }
      else if (event.key === 'Enter') {
        var links = doc.querySelectorAll('#find-results a');
        if (links[findState.sel]) { location.hash = links[findState.sel].getAttribute('href'); closeFind(); }
        event.preventDefault();
      }
      return;
    }
    if (event.key === 'Escape' && doc.body.classList.contains('mobile-nav-open')) { closeMobileNav(); event.preventDefault(); return; }
    if (typing) return;
    if (event.key === '/') { openFind(); event.preventDefault(); }
    else if (event.key === '?') { doc.getElementById('keys').hidden = false; event.preventDefault(); }
    else if (event.key === 'Escape') { doc.getElementById('keys').hidden = true; }
    else if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      var nx = doc.getElementById('nav-next');
      if (nx && nx.style.visibility !== 'hidden') location.hash = nx.getAttribute('href');
    }
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      var pv = doc.getElementById('nav-prev');
      if (pv && pv.style.visibility !== 'hidden') location.hash = pv.getAttribute('href');
    }
  }

  function closeMobileNav() {
    doc.body.classList.remove('mobile-nav-open');
    var toggle = doc.getElementById('mobile-nav-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    doc.getElementById('nav-backdrop').hidden = true;
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(message) {
    var t = doc.getElementById('toast');
    t.textContent = message;
    t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1600);
  }

  /* ---------- Wire up ---------- */
  window.addEventListener('hashchange', function () { applyAppearance(); go(); });
  doc.addEventListener('keydown', shortcuts);
  doc.getElementById('ov-find').addEventListener('click', openFind);
  doc.getElementById('keys-open').addEventListener('click', function () { doc.getElementById('keys').hidden = false; });
  doc.getElementById('keys-close').addEventListener('click', function () { doc.getElementById('keys').hidden = true; });
  doc.getElementById('keys').addEventListener('click', function (event) { if (event.target === this) this.hidden = true; });
  doc.getElementById('nav-collapse').addEventListener('click', function () {
    doc.body.classList.toggle('nav-collapsed');
    var expanded = !doc.body.classList.contains('nav-collapsed');
    this.setAttribute('aria-expanded', String(expanded));
    this.setAttribute('aria-label', expanded ? 'Collapse navigation' : 'Expand navigation');
    this.title = expanded ? 'Collapse navigation' : 'Expand navigation';
  });
  doc.getElementById('mobile-nav-toggle').addEventListener('click', function () {
    doc.body.classList.add('mobile-nav-open'); this.setAttribute('aria-expanded', 'true');
    doc.getElementById('nav-backdrop').hidden = false;
  });
  doc.getElementById('nav-close').addEventListener('click', closeMobileNav);
  doc.getElementById('nav-backdrop').addEventListener('click', closeMobileNav);
  doc.querySelector('aside.nav ol').addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-folder-toggle]');
    if (toggle) {
      var folder = toggle.closest('.nav-folder');
      if (folder) setFolderOpen(folder, toggle.getAttribute('aria-expanded') !== 'true');
      return;
    }
    if (event.target.closest('a')) closeMobileNav();
  });
  var findInput = doc.getElementById('find-input');
  findInput.addEventListener('input', function () { runSearch(findInput.value); });
  var appearanceButtons = doc.querySelectorAll('.appearance button');
  for (var b = 0; b < appearanceButtons.length; b += 1) {
    appearanceButtons[b].addEventListener('click', function () { setAppearance(this.getAttribute('data-appearance-set')); });
  }
  applyAppearance();
  go();
})();
`;

/* ------------------------------------------------------------------ */
/* Snapshot assembly                                                   */
/* ------------------------------------------------------------------ */

/** Stable JSON: sorted keys, no incidental whitespace variation. */
function stableJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * @param {object} input
 * @param {{title: string, description: string, html: string}} input.readme
 * @param {Array<{number: string, title: string, description: string, html: string, supporting: Array}>} input.sections
 * @param {string} input.stackName
 * @param {string|undefined} input.revision
 * @param {string} input.brandImage ArcShape lockup WebP encoded as base64
 */
function supportingLink(document) {
  return `<a href="${esc(document.route)}" data-route="${esc(document.route)}" data-relative-file="${esc(document.relativeFile || "")}"><span class="nav-title t">${esc(document.title)}</span></a>`;
}

function renderNavigationNodes(nodes, sectionNumber, state) {
  return nodes
    .map((node) => {
      if (node.kind === "page") {
        return `          <li>${supportingLink(node.document)}</li>`;
      }

      const label = node.page?.title || node.label;
      const folderId = `nav-folder-${sectionNumber}-${state.nextFolderId}`;
      state.nextFolderId += 1;
      const children = node.children.length
        ? `<ol id="${folderId}" class="supporting-nav" hidden>\n${renderNavigationNodes(node.children, sectionNumber, state)}\n          </ol>`
        : "";
      const toggle = children
        ? `<button type="button" class="nav-folder-toggle" data-folder-toggle aria-controls="${folderId}" aria-expanded="false" aria-label="Expand ${esc(label)}" title="Expand ${esc(label)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button>`
        : "";
      const page = node.page
        ? supportingLink(node.page)
        : `<span class="nav-title t">${esc(label)}</span>`;
      return `          <li class="nav-folder" data-folder-path="${esc(node.path)}" data-folder-label="${esc(label)}"><div class="nav-folder-row">${toggle}${page}</div>${children}</li>`;
    })
    .join("\n");
}

export function buildSnapshotHtml({
  readme,
  sections,
  stackName,
  revision,
  brandImage,
}) {
  const brandMark = brandImage
    ? `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><image class="brand-logo-light" href="data:image/webp;base64,${brandImage}" x="-10.8" y="-3.9" width="60" height="60" preserveAspectRatio="none"/><image class="brand-logo-dark" href="data:image/webp;base64,${brandImage}" x="-10.8" y="-3.9" width="60" height="60" preserveAspectRatio="none"/></svg></span>`
    : '<span class="brand-mark" aria-hidden="true"></span>';
  const revisionShort = revision
    ? `<span class="revshort" title="revision ${esc(revision)}">${esc(revision.slice(0, 7))}</span>`
    : '<span class="revshort" title="Not generated from a Git checkout">no revision</span>';

  const preparedSections = sections.map((section) => ({
    ...section,
    supporting: navigationBreadcrumbs(section.supporting ?? []),
  }));

  const navItems = preparedSections
    .map((s) => {
      const tree = buildNavigationTree(s.supporting ?? []);
      const hasFolders = tree.some((node) => node.kind === "folder");
      const supporting = hasFolders
        ? `<ol class="supporting-nav supporting-tree">\n${renderNavigationNodes(tree, s.number, { nextFolderId: 0 })}\n        </ol>`
        : (s.supporting ?? [])
            .map((document) => `          <li>${supportingLink(document)}</li>`)
            .join("\n");
      const supportingMarkup = supporting
        ? hasFolders
          ? supporting
          : `<ol class="supporting-nav">\n${supporting}\n        </ol>`
        : "";
      return `        <li><a href="#/section/${s.number}" data-route="#/section/${s.number}" data-category="${sectionCategory(s.number)}"><span class="nav-chevron"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 5 5-5 5"/></svg></span><span class="nav-kind"><span class="nav-icon">${sectionIcon(s.number)}</span><span class="nav-code">${SECTION_CODES[Number(s.number) - 1] || "SEC"}</span></span><span class="nav-title t">${esc(s.title)}</span><span class="nav-number">${esc(s.number)}</span></a>${supportingMarkup}</li>`;
    })
    .join("\n");

  const data = {
    readme: {
      title: readme.title,
      description: readme.description,
      html: readme.html,
    },
    sections: preparedSections.map((s) => ({
      number: s.number,
      title: s.title,
      description: s.description,
      html: s.html,
      supporting: s.supporting ?? [],
      category: sectionCategory(s.number),
      icon: sectionIcon(s.number),
      code: SECTION_CODES[Number(s.number) - 1] || "SEC",
    })),
  };

  const lines = [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; script-src 'sha256-${createHash("sha256").update(`\n${script}\n`).digest("base64")}'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">`,
    '<meta name="color-scheme" content="light dark">',
    `<title>ArcShape — ${esc(stackName)} arc42 Architecture Snapshot</title>`,
    `<style>\n${style}\n</style>`,
    "</head>",
    "<body>",
    '<a class="skip" href="#main">Skip to content</a>',
    '<header class="site">',
    '<div class="header-inner">',
    `<h1>${brandMark}<span class="brand-title">ArcShape</span></h1>`,
    '<span class="brand-caption">AI driven engineering documentation</span>',
    `<span class="project-context" title="${esc(stackName)} · arc42">${esc(stackName)} · arc42</span>`,
    revisionShort,
    '<nav class="primary-nav" aria-label="Primary navigation"><a href="#/" data-route="#/">Overview</a></nav>',
    '<span class="spacer"></span>',
    '<div class="appearance" role="group" aria-label="Appearance">',
    '  <button type="button" data-appearance-set="auto" aria-pressed="true">Auto</button>',
    '  <button type="button" data-appearance-set="light" aria-pressed="false">Light</button>',
    '  <button type="button" data-appearance-set="dark" aria-pressed="false">Dark</button>',
    "</div>",
    '<button type="button" class="iconbtn" id="ov-find" aria-haspopup="dialog" aria-label="Search (/)" title="Search (/)"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6.8" cy="6.8" r="4.4"/><path d="m10.2 10.2 3 3"/></svg></button>',
    '<button type="button" class="iconbtn mobile-nav-toggle" id="mobile-nav-toggle" aria-controls="arc42-nav" aria-expanded="false" aria-label="Open sections navigation" title="Open navigation"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12"/></svg></button>',
    '<button type="button" class="iconbtn" id="keys-open" aria-haspopup="dialog" aria-label="Keyboard shortcuts (?)" title="Keyboard shortcuts (?)">?</button>',
    "</div>",
    "</header>",
    '<div id="shell">',
    '<aside class="nav" id="arc42-nav" aria-label="arc42 sections">',
    '  <div class="nav-heading"><h2>Sections</h2><button type="button" class="iconbtn" id="nav-collapse" aria-label="Collapse navigation" aria-expanded="true" title="Collapse navigation"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M6 2v12"/></svg></button><button type="button" class="iconbtn" id="nav-close" aria-label="Close navigation" title="Close navigation"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg></button></div>',
    "  <ol>",
    navItems,
    "  </ol>",
    '  <div class="nav-foot">',
    '    <div class="prevnext">',
    '      <a id="nav-prev" href="#/" aria-label="Previous section"></a>',
    '      <a id="nav-next" href="#/" aria-label="Next section"></a>',
    "    </div>",
    "  </div>",
    "</aside>",
    '<button type="button" id="nav-backdrop" aria-label="Close navigation" hidden></button>',
    '<main id="main">',
    '  <div id="content"></div>',
    "</main>",
    "</div>",
    '<div class="dlg" id="find" role="dialog" aria-modal="true" aria-labelledby="find-title" hidden>',
    '<div class="dlgbox">',
    `  <input id="find-input" type="text" placeholder="Search ${esc(stackName)} docs…" aria-label="Search query" autocomplete="off">`,
    '  <ul id="find-results"></ul>',
    "</div>",
    "</div>",
    '<div class="dlg" id="keys" role="dialog" aria-modal="true" aria-labelledby="keys-title" hidden>',
    '<div class="dlgbox keysbox">',
    '  <input type="text" value="Keyboard shortcuts" aria-label="Keyboard shortcuts" readonly>',
    "  <dl>",
    "    <dt><kbd>/</kbd></dt><dd>Search the overview and all sections</dd>",
    "    <dt><kbd>←</kbd> / <kbd>→</kbd></dt><dd>Previous / next section</dd>",
    "    <dt><kbd>?</kbd></dt><dd>Show this list</dd>",
    "    <dt><kbd>Esc</kbd></dt><dd>Close dialogs</dd>",
    "  </dl>",
    '  <p style="margin:0; padding:0.6rem 0.9rem 0.9rem; text-align:right;"><button type="button" id="keys-close">Close</button></p>',
    "</div>",
    "</div>",
    '<p class="toast" id="toast" role="status" aria-live="polite"></p>',
    `<script id="arc42-data" type="application/json">${stableJson(data)}</script>`,
    `<script>\n${script}\n</script>`,
    "</body>",
    "</html>",
  ];
  return `${lines.filter((l) => l !== "").join("\n")}\n`;
}
