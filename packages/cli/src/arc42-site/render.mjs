import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, posix } from "node:path";
import { relative, resolve, sep } from "node:path";
import { existsSync, statSync } from "node:fs";
import { Marked } from "marked";
import GithubSlugger from "github-slugger";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { getPuppeteerLaunchOptions } from "./browser-options.mjs";

const window = new JSDOM("").window;
const purifier = createDOMPurify(window);

export const MERMAID_CONFIG = Object.freeze({
  securityLevel: "strict",
  htmlLabels: false,
  theme: "base",
  themeVariables: {
    fontFamily: "system-ui, sans-serif",
    fontSize: "16px",
    primaryColor: "#e6f4ea",
    primaryTextColor: "#163b25",
    primaryBorderColor: "#1b5e36",
    lineColor: "#334e5c",
    secondaryColor: "#eaf2f8",
    secondaryTextColor: "#123045",
    secondaryBorderColor: "#245679",
    tertiaryColor: "#fff4d6",
    tertiaryTextColor: "#3c2900",
    tertiaryBorderColor: "#805500",
    background: "#ffffff",
  },
});

export function getDiagramAccessibleTitle(source) {
  return /^\s*accTitle:\s*(.+?)\s*$/im.exec(source)?.[1]?.trim() ?? "";
}

export function stripDiagramAccessibilityTitle(source) {
  return String(source).replace(/^\s*accTitle:\s*.+?\s*\r?\n/im, "");
}

export function validateDiagramTitles(sources) {
  return sources.flatMap((source, index) =>
    getDiagramAccessibleTitle(source)
      ? []
      : [`Diagram ${index + 1} is missing an accTitle accessibility name`],
  );
}

/** Escape text for safe interpolation into HTML. */
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normalizeMermaidSvg(svg, index) {
  const clean = purifier.sanitize(svg, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ADD_TAGS: ["foreignObject"],
    FORBID_TAGS: [
      "script",
      "iframe",
      "object",
      "embed",
      "image",
      "img",
      "audio",
      "video",
      "link",
      "use",
      "animate",
      "set",
      "animateMotion",
      "animateTransform",
    ],
  });
  const document = new window.DOMParser().parseFromString(
    clean,
    "image/svg+xml",
  );
  const root = document.documentElement;
  if (root.localName !== "svg" || document.querySelector("parsererror")) {
    throw new Error("Mermaid produced invalid SVG");
  }
  const rootId = `mmd-${index}`;
  const idMap = new Map();
  for (const element of [root, ...root.querySelectorAll("[id]")]) {
    const oldId = element.getAttribute("id");
    const newId = element === root ? rootId : `${rootId}-x${idMap.size}`;
    if (oldId) idMap.set(oldId, newId);
    element.setAttribute("id", newId);
  }
  const rewriteReferences = (value) =>
    value.replace(/url\(\s*["']?#([^\s)"']+)["']?\s*\)/g, (match, id) =>
      idMap.has(id) ? `url(#${idMap.get(id)})` : match,
    );
  const unsafeCss = (value) =>
    /@import|(?:https?:|data:|file:|\/\/)|url\(\s*["']?(?!#)/i.test(value);
  for (const element of [root, ...root.querySelectorAll("*")]) {
    for (const attribute of [...element.attributes]) {
      const { name, value } = attribute;
      if (/^(?:href|xlink:href|src)$/i.test(name)) {
        if (value.startsWith("#") && idMap.has(value.slice(1))) {
          element.setAttribute(name, `#${idMap.get(value.slice(1))}`);
        } else {
          element.removeAttribute(name);
        }
      } else if (name === "aria-labelledby" || name === "aria-describedby") {
        element.setAttribute(
          name,
          value
            .split(/\s+/)
            .map((id) => idMap.get(id) ?? id)
            .join(" "),
        );
      } else if (unsafeCss(value)) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, rewriteReferences(value));
      }
    }
  }
  for (const style of root.querySelectorAll("style")) {
    if (unsafeCss(style.textContent)) {
      style.remove();
    } else {
      style.textContent = rewriteReferences(style.textContent).replace(
        /#([a-zA-Z_][\w:.-]*)/g,
        (match, id) => (idMap.has(id) ? `#${idMap.get(id)}` : match),
      );
    }
  }
  const width = /max-width:\s*([\d.]+)px/.exec(
    root.getAttribute("style") ?? "",
  );
  root.removeAttribute("style");
  if (width)
    root.setAttribute("style", `max-width: ${Math.round(Number(width[1]))}px`);
  return new window.XMLSerializer().serializeToString(root);
}

/**
 * Pre-render mermaid diagram sources to normalized inline SVGs.
 * @param {string[]} sources mermaid diagram sources, in document order
 * @returns {Promise<string[]>} normalized SVG strings
 */
export async function renderMermaid(sources) {
  if (sources.length === 0) return [];
  const titleIssues = validateDiagramTitles(sources);
  if (titleIssues.length > 0) {
    throw new Error(
      `Mermaid accessibility contract violations:\n  - ${titleIssues.join("\n  - ")}`,
    );
  }
  const { run } = await import("@mermaid-js/mermaid-cli");
  const staging = await mkdtemp(join(tmpdir(), "arc42-mermaid-"));
  try {
    const svgFiles = [];
    for (let i = 0; i < sources.length; i += 1) {
      const inFile = join(staging, `d${i}.mmd`);
      const outFile = join(staging, `d${i}.svg`);
      await writeFile(
        inFile,
        stripDiagramAccessibilityTitle(sources[i]),
        "utf8",
      );
      await run(inFile, outFile, {
        quiet: true,
        outputFormat: "svg",
        puppeteerConfig: getPuppeteerLaunchOptions(),
        parseMMDOptions: {
          backgroundColor: "transparent",
          mermaidConfig: MERMAID_CONFIG,
        },
      });
      const raw = await readFile(outFile, "utf8");
      svgFiles.push(normalizeMermaidSvg(raw, i));
    }
    return svgFiles;
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

function isMermaid(lang) {
  return (
    String(lang ?? "")
      .trim()
      .split(/\s+/)[0] === "mermaid"
  );
}

function normalizedHeading(text) {
  return String(text ?? "")
    .replace(/^\s*\d{1,2}[.)]\s*/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();
}

/** Remove a leading H1 that repeats the title already rendered from frontmatter. */
export function stripDuplicateTitle(body, title) {
  if (!title) return body;
  const marked = new Marked({ gfm: true });
  const tokens = marked.lexer(body);
  let offset = 0;
  for (const token of tokens) {
    if (
      token.type === "space" ||
      (token.type === "html" && /^\s*<!--[\s\S]*-->\s*$/.test(token.text))
    ) {
      offset += token.raw.length;
      continue;
    }
    if (
      token.type === "heading" &&
      token.depth === 1 &&
      normalizedHeading(token.text) === normalizedHeading(title)
    ) {
      return body.slice(0, offset) + body.slice(offset + token.raw.length);
    }
    break;
  }
  return body;
}

function createMarked(
  fileToRoute,
  svgs,
  diagramTitles,
  currentRoute,
  sourceContext,
  sourceFile,
  sourceRevision,
  siteBase,
) {
  const marked = new Marked({ gfm: true });
  const slugger = new GithubSlugger();
  let mermaidCount = 0;

  marked.use({
    renderer: {
      html({ text }) {
        // Markdownlint directives and other HTML comments are source metadata, not page content.
        if (/^\s*<!--[\s\S]*-->\s*$/.test(text)) return "";
        return escapeHtml(text);
      },
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = window.document.createElement("div");
        plain.innerHTML = text;
        const id = slugger.slug(plain.textContent);
        return `<h${depth} id="${escapeHtml(id)}">${text}</h${depth}>\n`;
      },
      code({ text, lang }) {
        if (isMermaid(lang)) {
          const index = mermaidCount++;
          const svg = svgs[index];
          if (!svg)
            throw new Error(
              "Mermaid diagram count does not match parsed Markdown",
            );
          const title = diagramTitles[index];
          if (!title)
            throw new Error(
              `Mermaid diagram ${index + 1} is missing an accTitle accessibility name`,
            );
          const sourcePath = sourceFile ?? "canonical architecture Markdown";
          const sourceHref = githubSourceFileLink(sourceContext, sourceFile);
          const revisionHref =
            sourceContext?.repositoryUrl && sourceRevision
              ? `${sourceContext.repositoryUrl}/commit/${encodeURIComponent(sourceRevision)}`
              : undefined;
          const diagramId = `mermaid-${String(sourceFile ?? "source").replace(
            /[^a-zA-Z0-9_-]+/g,
            "-",
          )}-${index}`;
          const labelledSvg = addMermaidSvgLabels(
            svg,
            title,
            `mermaid-title-${diagramId}`,
            `mermaid-description-${diagramId}`,
            `Mermaid diagram rendered from ${sourcePath}.`,
          );
          const source = sourceHref
            ? `<a href="${escapeHtml(sourceHref)}" rel="noopener noreferrer">${escapeHtml(sourcePath)}</a>`
            : `<span>${escapeHtml(sourcePath)}</span>`;
          const revision = sourceRevision
            ? revisionHref
              ? `<a href="${escapeHtml(revisionHref)}" rel="noopener noreferrer">${escapeHtml(sourceRevision)}</a>`
              : escapeHtml(sourceRevision)
            : "unavailable";
          return `<figure class="diagram"><figcaption id="${diagramId}" class="diagram-caption"><span class="diagram-title">${escapeHtml(title)}</span><span class="diagram-renderer">Renderer: Mermaid</span><span>Source Markdown: ${source}</span><span>Source revision: ${revision}</span></figcaption>${labelledSvg}</figure>`;
        }
        const escaped = escapeHtml(text);
        return `<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ""}>${escaped}</code></pre>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const target = String(href ?? "");
        const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
        if (/^(?:https?:|mailto:)/i.test(target)) {
          return `<a href="${escapeHtml(target)}"${titleAttribute} rel="noopener noreferrer">${text}</a>`;
        }
        const hashIndex = target.indexOf("#");
        let path = hashIndex < 0 ? target : target.slice(0, hashIndex);
        let anchor = hashIndex < 0 ? "" : target.slice(hashIndex + 1);
        try {
          path = decodeURIComponent(path);
          anchor = decodeURIComponent(anchor);
        } catch {
          return `<span class="xref-dead">${text} <code>${escapeHtml(target)}</code></span>`;
        }
        const route = path
          ? fileToRoute.get(posix.normalize(path))
          : target.startsWith("#")
            ? currentRoute
            : undefined;
        if (route) {
          const hash = anchor
            ? `${route.replace(/\/$/, "")}/${encodeURIComponent(anchor)}`
            : route;
          return `<a href="${escapeHtml(hash)}"${titleAttribute}>${text}</a>`;
        }
        const publicationAsset = path
          ? posix.normalize(posix.join(posix.dirname(sourceFile ?? ""), path))
          : "";
        const publicationPrefix = "src/engineering-portal/public/diagrams/";
        if (publicationAsset.startsWith(publicationPrefix)) {
          const filename = publicationAsset.slice(publicationPrefix.length);
          if (/^[a-zA-Z0-9._-]+\.html$/.test(filename)) {
            const base = siteBase.endsWith("/") ? siteBase : `${siteBase}/`;
            const href = `${base}diagrams/${encodeURIComponent(filename)}${anchor ? `#${encodeURIComponent(anchor)}` : ""}`;
            return `<a href="${escapeHtml(href)}"${titleAttribute}>${text}</a>`;
          }
        }
        const sourceLink = githubSourceLink(
          sourceContext,
          sourceFile,
          path,
          anchor,
        );
        if (sourceLink)
          return `<a href="${escapeHtml(sourceLink)}"${titleAttribute} rel="noopener noreferrer">${text}</a>`;
        return `<span class="xref-dead">${text} <code>${escapeHtml(target)}</code></span>`;
      },
      image({ href, text }) {
        // No images are carried in the single file; name them honestly.
        return `<span class="xref-dead">[image: ${escapeHtml(String(text ?? ""))}] <code>${escapeHtml(String(href ?? ""))}</code></span>`;
      },
    },
  });

  return { marked, count: () => mermaidCount };
}

function githubSourceFileLink(sourceContext, sourceFile) {
  if (!sourceContext || !sourceFile) return undefined;
  const absolutePath = resolve(sourceContext.root, ...sourceFile.split("/"));
  const relativePath = relative(sourceContext.root, absolutePath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    !existsSync(absolutePath) ||
    statSync(absolutePath).isDirectory()
  )
    return undefined;
  const encodedRef = encodeURIComponent(sourceContext.ref);
  const encodedPath = sourceFile
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${sourceContext.repositoryUrl}/blob/${encodedRef}/${encodedPath}`;
}

function addMermaidSvgLabels(svg, title, titleId, descriptionId, description) {
  const document = new window.DOMParser().parseFromString(svg, "image/svg+xml");
  const root = document.documentElement;
  if (root.localName !== "svg" || document.querySelector("parsererror"))
    throw new Error("Rendered Mermaid diagram is not valid SVG");
  const accessibleTitle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "title",
  );
  accessibleTitle.setAttribute("id", titleId);
  accessibleTitle.textContent = title;
  const accessibleDescription = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "desc",
  );
  accessibleDescription.setAttribute("id", descriptionId);
  accessibleDescription.textContent = description;
  root.insertBefore(accessibleDescription, root.firstChild);
  root.insertBefore(accessibleTitle, accessibleDescription);
  root.setAttribute("role", "img");
  root.setAttribute("aria-labelledby", titleId);
  root.setAttribute("aria-describedby", descriptionId);
  return new window.XMLSerializer().serializeToString(root);
}

function githubSourceLink(sourceContext, sourceFile, path, anchor) {
  if (!sourceContext || !sourceFile || !path) return undefined;
  const sourcePath = posix.normalize(
    posix.join(posix.dirname(sourceFile), path),
  );
  if (
    sourcePath === ".." ||
    sourcePath.startsWith("../") ||
    posix.isAbsolute(sourcePath)
  )
    return undefined;
  const absolutePath = resolve(sourceContext.root, ...sourcePath.split("/"));
  const relativePath = relative(sourceContext.root, absolutePath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    !existsSync(absolutePath)
  )
    return undefined;
  const kind = statSync(absolutePath).isDirectory() ? "tree" : "blob";
  const encodedRef = encodeURIComponent(sourceContext.ref);
  const encodedPath = sourcePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const fragment = anchor ? `#${encodeURIComponent(anchor)}` : "";
  return `${sourceContext.repositoryUrl}/${kind}/${encodedRef}/${encodedPath}${fragment}`;
}

/**
 * Render one Markdown document to HTML.
 *
 * @param {string} body markdown source (frontmatter already stripped)
 * @param {object} opts
 * @param {string} opts.title frontmatter title, used to suppress a repeated leading H1
 * @param {Map<string,string>} opts.fileToRoute section file name -> hash route
 * @param {string[]} opts.svgs pre-rendered mermaid SVGs for this document
 * @param {string} opts.svgClass css class for inline svg wrappers
 */
export async function renderMarkdown(
  body,
  {
    fileToRoute,
    svgs = [],
    currentRoute = "#/",
    title = "",
    sourceContext,
    sourceFile,
    sourceRevision,
    siteBase = "/",
  },
) {
  const diagramSources = extractMermaidSources(body);
  const titleIssues = validateDiagramTitles(diagramSources);
  if (titleIssues.length > 0) {
    throw new Error(
      `Mermaid accessibility contract violations:\n  - ${titleIssues.join("\n  - ")}`,
    );
  }
  const diagramTitles = diagramSources.map(getDiagramAccessibleTitle);
  const renderer = createMarked(
    fileToRoute,
    svgs,
    diagramTitles,
    currentRoute,
    sourceContext,
    sourceFile,
    sourceRevision,
    siteBase,
  );
  const html = await renderer.marked.parse(stripDuplicateTitle(body, title));
  if (renderer.count() !== svgs.length)
    throw new Error(
      "Unused Mermaid SVGs: Markdown extraction and rendering disagree",
    );
  return { html, mermaidCount: renderer.count() };
}

/**
 * Extract mermaid sources and a body with placeholders removed is not needed:
 * instead we count diagrams by scanning fenced blocks before rendering, so the
 * SVGs can be pre-rendered in one batch per document.
 */
export function extractMermaidSources(body) {
  const marked = new Marked({ gfm: true });
  const sources = [];
  marked.walkTokens(marked.lexer(body), (token) => {
    if (token.type === "code" && isMermaid(token.lang))
      sources.push(token.text);
  });
  return sources;
}
