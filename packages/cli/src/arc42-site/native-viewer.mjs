import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";

export const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const hash = (code) =>
  `'sha256-${createHash("sha256").update(code).digest("base64")}'`;
function policy(scripts, frames = "'none'") {
  return `default-src 'none'; script-src ${scripts.map(hash).join(" ")}; style-src 'unsafe-inline'; img-src data: blob:; frame-src ${frames}; base-uri 'none'; form-action 'none'; connect-src 'none'; object-src 'none'`;
}
const compactStyle = `html[data-arcshape-compact],html[data-arcshape-compact] body{height:100%!important;min-height:0!important;overflow:hidden!important}
.diagram-container.is-pannable{touch-action:none!important}
html[data-arcshape-compact] body{padding:0!important;background-image:none!important}
html[data-arcshape-compact] :is(.header,.toolbar,.cards,.guided-views){display:none!important}
html[data-arcshape-compact] .container{height:100%!important;width:100%!important;max-width:none!important;gap:0!important}
html[data-arcshape-compact] .diagram-container{height:100%!important;min-height:0!important;width:100%!important;padding:12px 12px 42px!important;overflow:hidden!important;border:0!important;border-radius:0!important;box-shadow:none!important;display:flex!important;align-items:center!important;justify-content:center!important}
html[data-arcshape-compact] .diagram-container>svg{width:100%!important;height:100%!important;min-width:0!important;max-width:none!important;flex:1 1 auto!important}
html[data-arcshape-compact] .diagram-nav{position:absolute!important;right:8px!important;bottom:6px!important;top:auto!important;transform:none!important}
html[data-arcshape-compact] .diagram-nav>:not([data-view]){display:none!important}`;

function childBridge() {
  const send = (type, data = {}) =>
    parent.postMessage({ v: 1, type, ...data }, "*");
  const validId = (value) =>
    typeof value === "string" && value.length <= 200 && !/[<>]/.test(value);
  let compact = false;
  function state() {
    const relation = window.Archify.focus.relationship();
    const focus = window.Archify.focus.active();
    send("state", {
      theme: document.documentElement.dataset.theme,
      selection: relation?.id
        ? { kind: "relation", id: relation.id }
        : typeof focus === "string"
          ? { kind: "focus", id: focus }
          : null,
    });
  }
  addEventListener("message", (event) => {
    const data = event.data;
    if (event.source !== parent || data?.v !== 1 || data.type !== "configure")
      return;
    compact = data.compact === true;
    document.documentElement.toggleAttribute("data-arcshape-compact", compact);
    if (
      typeof data.linkBase === "string" &&
      /^(https?:|file:)\/\//.test(data.linkBase)
    )
      window.readerLink = (state) => data.linkBase + "#" + state;
    if (
      ["light", "dark"].includes(data.theme) &&
      document.documentElement.dataset.theme !== data.theme
    )
      window.Archify.theme.toggle();
    if (data.selection && validId(data.selection.id)) {
      if (data.selection.kind === "focus")
        window.Archify.focus.set(data.selection.id, {
          updateUrl: false,
          toggle: false,
        });
      if (data.selection.kind === "relation")
        window.Archify.focus.inspectRelationshipById(data.selection.id, {
          updateUrl: false,
          toggle: false,
        });
    }
    requestAnimationFrame(() => {
      window.Archify.view.reset();
      state();
      requestAnimationFrame(() => send("painted"));
    });
  });
  for (const type of ["click", "keyup"])
    document.addEventListener(type, () => requestAnimationFrame(state));
  new MutationObserver(state).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  // Export only the sanitized build-time SVG through the trusted outer page.
  const exportButton = document.getElementById("btn-export");
  exportButton.textContent = "SVG ↓";
  exportButton.setAttribute("aria-label", "Download diagram as SVG");
  exportButton.removeAttribute("aria-haspopup");
  exportButton.title = "Download diagram as SVG";
  exportButton.addEventListener(
    "click",
    (event) => {
      event.stopImmediatePropagation();
      send("export-svg");
    },
    true,
  );
  document.addEventListener(
    "wheel",
    (event) => {
      if (
        !compact ||
        event.ctrlKey ||
        event.metaKey ||
        event.target.closest(".focus-chip,.node-finder,.diagram-guide")
      )
        return;
      event.preventDefault();
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      send("wheel", {
        delta: Math.max(-2000, Math.min(2000, event.deltaY * unit)),
      });
    },
    { passive: false },
  );
  send("ready");
}

function wrapperRuntime() {
  const frame = document.querySelector("iframe");
  const fallback = document.querySelector("img");
  const data = JSON.parse(document.getElementById("viewer-data").textContent);
  const params = new URLSearchParams(location.search);
  const hashParams = new URLSearchParams(location.hash.slice(1));
  const compact = params.get("compact") === "1";
  const linkBase = new URL(location.href);
  linkBase.searchParams.delete("compact");
  linkBase.hash = "";
  let ready = false;
  const validSelection = (s) =>
    s === null ||
    (s &&
      ["focus", "relation"].includes(s.kind) &&
      typeof s.id === "string" &&
      s.id.length <= 200 &&
      !/[<>]/.test(s.id));
  let configuration = {
    v: 1,
    type: "configure",
    compact,
    linkBase: linkBase.href,
    theme: params.get("theme") === "dark" ? "dark" : "light",
    selection: null,
  };
  for (const kind of ["focus", "relation"])
    if (hashParams.has(kind)) {
      const selection = { kind, id: hashParams.get(kind) };
      if (validSelection(selection)) configuration.selection = selection;
    }
  function send() {
    frame.contentWindow.postMessage(configuration, "*");
  }
  addEventListener("message", (event) => {
    const message = event.data;
    if (message?.v !== 1) return;
    if (event.source === frame.contentWindow) {
      if (message.type === "export-svg" && parent === window) {
        const link = document.createElement("a");
        link.href = "./diagram.svg";
        link.download = "diagram.svg";
        link.click();
      } else if (message.type === "ready") {
        frame.hidden = false;
        send();
      } else if (message.type === "painted" && !ready) {
        ready = true;
        fallback.hidden = true;
        document.documentElement.dataset.ready = "true";
        if (parent !== window) parent.postMessage({ v: 1, type: "ready" }, "*");
      } else if (
        message.type === "state" &&
        ["light", "dark"].includes(message.theme) &&
        validSelection(message.selection)
      ) {
        configuration.theme = message.theme;
        configuration.selection = message.selection;
        if (parent !== window)
          parent.postMessage(
            {
              v: 1,
              type: "state",
              theme: message.theme,
              selection: message.selection,
            },
            "*",
          );
        else {
          const url = new URL(location.href);
          url.searchParams.set("theme", message.theme);
          const hash = new URLSearchParams();
          if (message.selection)
            hash.set(message.selection.kind, message.selection.id);
          url.hash = hash.toString();
          history.replaceState(null, "", url);
        }
      } else if (
        message.type === "wheel" &&
        compact &&
        Number.isFinite(message.delta) &&
        Math.abs(message.delta) <= 2000 &&
        parent !== window
      )
        parent.postMessage({ v: 1, type: "wheel", delta: message.delta }, "*");
    } else if (
      parent !== window &&
      event.source === parent &&
      message.type === "configure" &&
      ["light", "dark"].includes(message.theme) &&
      validSelection(message.selection ?? null)
    ) {
      configuration = {
        ...configuration,
        theme: message.theme,
        selection: message.selection ?? configuration.selection,
      };
      send();
    }
  });
  frame.srcdoc = data.html;
}

export function buildNativeViewer(diagram) {
  const bridge = `(${childBridge.toString()})();`;
  let runtime = diagram.html
    .replace("</head>", `<style>${compactStyle}</style></head>`)
    .replace("</body>", `<script>${bridge}</script></body>`);
  const parsed = new JSDOM(runtime);
  // SVG permits comma separators; avoid mistaking coordinate runs for card numbers.
  for (const path of parsed.window.document.querySelectorAll("svg path[d]"))
    path.setAttribute(
      "d",
      path.getAttribute("d").replace(/(\d)\s+(?=[+-]?(?:\d|\.\d))/g, "$1,"),
    );
  runtime = parsed.serialize();
  const runtimeScripts = Array.from(
    parsed.window.document.scripts,
    (script) => script.textContent,
  );
  parsed.window.close();
  runtime = runtime.replace(
    /<head[^>]*>/i,
    (match) =>
      `${match}<meta http-equiv="Content-Security-Policy" content="${escapeAttribute(policy(runtimeScripts))}">`,
  );
  const script = `(${wrapperRuntime.toString()})();`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${escapeAttribute(policy([...runtimeScripts, script], "about:"))}"><title>${escapeAttribute(diagram.title)}</title><style>html,body{margin:0;min-height:100%;width:100%;background:#f8fafc}iframe{position:absolute;inset:0;display:block;border:0;width:100%;height:100vh}img{display:block;width:100%;height:auto} [hidden]{display:none!important}</style></head><body><img alt="${escapeAttribute(diagram.title)}" src="data:image/svg+xml;base64,${Buffer.from(diagram.svg).toString("base64")}"><iframe hidden sandbox="allow-scripts" title="${escapeAttribute(diagram.title)}"></iframe><script id="viewer-data" type="application/json">${json({ html: runtime })}</script><script>${script}</script></body></html>`;
}

export function nativeFigure(diagram, interactive) {
  const title = escapeAttribute(diagram.title);
  const image = `<img alt="${title}" src="data:image/svg+xml;base64,${Buffer.from(diagram.svg).toString("base64")}" width="${diagram.width}" height="${diagram.height}" style="width:100%;height:auto">`;
  if (!interactive) return `<figure class="native-diagram">${image}</figure>`;
  const url = `diagrams/${diagram.id}/index.html`;
  return `<figure class="native-diagram" data-native-diagram data-ratio="${diagram.width / diagram.height}"><div class="native-viewport">${image}<iframe data-native-frame sandbox="allow-scripts" title="${title}" src="${url}?compact=1"></iframe></div><a class="native-open" href="${url}" target="_blank" rel="noopener noreferrer">Open full screen ↗</a></figure>`;
}

export const nativeReaderStyle = `.native-diagram{margin:1.5rem 0;width:100%;min-width:0}.native-viewport{position:relative;width:100%;overflow:hidden;border:1px solid var(--line,#dce3ed);border-radius:6px}.native-viewport>img{position:relative;z-index:1;pointer-events:none}.native-viewport iframe{position:absolute;inset:0;border:0;width:100%;height:100%;display:block}.native-viewport iframe[data-ready]{opacity:1;pointer-events:auto}.native-viewport:has(iframe[data-ready])>img{visibility:hidden}.native-open{display:block;width:fit-content;margin:.5rem 0 .5rem auto;font-size:.85rem}`;

function readerRuntime() {
  const content = document.getElementById("content");
  const frames = new Map();
  const selections = new Map();
  function selectionHash(selection) {
    const params = new URLSearchParams();
    if (selection) params.set(selection.kind, selection.id);
    return params.toString();
  }
  const theme = () =>
    document.documentElement.dataset.appearance ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function sync() {
    for (const [frame, observer] of frames)
      if (!frame.isConnected) {
        observer.disconnect();
        frames.delete(frame);
      }
    for (const figure of content.querySelectorAll("[data-native-diagram]")) {
      const frame = figure.querySelector("iframe"),
        link = figure.querySelector(".native-open");
      if (!frames.has(frame)) {
        const observer = new ResizeObserver(() => {
          frame.parentElement.style.height = `${Math.round(Math.min(560, Math.max(260, (figure.clientWidth - 24) / Number(figure.dataset.ratio) + 54)))}px`;
        });
        observer.observe(figure);
        frames.set(frame, observer);
      }
      const url = new URL(link.href);
      url.searchParams.set("theme", theme());
      const selection = selections.get(frame.getAttribute("src")) ?? null;
      url.hash = selectionHash(selection);
      link.href = url.href;
      frame.contentWindow?.postMessage(
        { v: 1, type: "configure", theme: theme(), selection },
        "*",
      );
    }
  }
  addEventListener("message", (event) => {
    const frame = [...frames.keys()].find(
      (item) => item.contentWindow === event.source,
    );
    const data = event.data;
    if (!frame || data?.v !== 1) return;
    if (data.type === "ready") {
      frame.dataset.ready = "true";
      sync();
      frame.parentElement.style.height = `${Math.round(Math.min(560, Math.max(260, (frame.parentElement.clientWidth - 24) / Number(frame.closest("figure").dataset.ratio) + 54)))}px`;
    }
    if (
      data.type === "wheel" &&
      Number.isFinite(data.delta) &&
      Math.abs(data.delta) <= 2000
    )
      document
        .getElementById("main")
        .scrollBy({ top: data.delta, behavior: "instant" });
    if (data.type === "state" && frame.dataset.ready) {
      const s = data.selection;
      if (
        s !== null &&
        !(
          s &&
          ["focus", "relation"].includes(s.kind) &&
          typeof s.id === "string" &&
          s.id.length <= 200 &&
          !/[<>]/.test(s.id)
        )
      )
        return;
      const link = frame.closest("figure").querySelector("a"),
        url = new URL(link.href);
      selections.set(frame.getAttribute("src"), s);
      url.hash = selectionHash(s);
      link.href = url.href;
    }
  });
  new MutationObserver(sync).observe(content, { childList: true });
  new MutationObserver(sync).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-appearance"],
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", sync);
  sync();
}
export const nativeReaderScript = `(${readerRuntime.toString()})();`;
