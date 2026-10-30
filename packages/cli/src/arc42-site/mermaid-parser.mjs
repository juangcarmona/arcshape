import { parentPort, workerData } from "node:worker_threads";
import { JSDOM } from "jsdom";

const dom = new JSDOM("");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
try {
  const { default: mermaid } = await import("mermaid");
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
  // Older ArcShape sources place accTitle before the diagram header.
  const title =
    /^\s*accTitle:\s*(.+?)\s*$/im.exec(workerData)?.[1]?.trim() ?? "";
  const source = workerData.replace(/^\s*accTitle:\s*.+?\s*\r?\n/im, "");
  const diagram = await mermaid.mermaidAPI.getDiagramFromText(source);
  const db = diagram.db;
  parentPort.postMessage({
    type: diagram.type,
    ...(/^flowchart/.test(diagram.type)
      ? {
          vertices: [...db.getVertices().values()],
          edges: [...db.getEdges()],
          groups: db.getSubGraphs(),
          direction: db.getDirection(),
          title,
        }
      : {}),
  });
} catch (error) {
  parentPort.postMessage({ error: error.message });
} finally {
  dom.window.close();
}
