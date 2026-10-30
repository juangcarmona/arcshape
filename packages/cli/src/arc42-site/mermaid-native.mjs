import { Worker } from "node:worker_threads";
import { graphlib } from "dagre-d3-es";
import { layout } from "dagre-d3-es/src/dagre/index.js";
import { parseNativeDiagram } from "./native-diagrams.mjs";

function parseMermaid(source) {
  // A fresh JS realm binds Mermaid's DOMPurify without changing the reader DOM.
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./mermaid-parser.mjs", import.meta.url),
      {
        workerData: source,
        execArgv: [],
        resourceLimits: { maxOldGenerationSizeMb: 256 },
      },
    );
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error("Mermaid parser timed out"));
    }, 30000);
    worker.once("message", (result) => {
      clearTimeout(timer);
      worker.terminate();
      if (result.error) reject(new Error(result.error));
      else resolve(result);
    });
    worker.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    worker.once("exit", (code) => {
      clearTimeout(timer);
      reject(
        new Error(`Mermaid parser exited before returning data (code ${code})`),
      );
    });
  });
}

const plain = (text) =>
  typeof text === "string" &&
  text.length > 0 &&
  text.length <= 90 &&
  !/[<>\r\n]|(?:https?:|data:|javascript:|file:)|#(?:\w+);/i.test(text);
const identifier = (id) => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(id);

function convertSequence(diagram, location) {
  const unsupported = (reason) => ({ status: "unsupported", reason });
  const { actors, messages } = diagram;
  if (
    actors.length < 2 ||
    actors.length > 12 ||
    !messages.length ||
    messages.length > 100 ||
    diagram.boxes.length ||
    diagram.created.length ||
    diagram.destroyed.length ||
    diagram.numbered
  )
    return unsupported(
      "sequence limits, boxes, creation/destruction or numbering",
    );
  for (const [id, actor] of actors)
    if (
      !identifier(id) ||
      !plain(actor.description) ||
      actor.type !== "participant" ||
      actor.wrap ||
      actor.rectData ||
      Object.keys(actor.links).length ||
      Object.keys(actor.properties).length
    )
      return unsupported("sequence participant notation, label or metadata");
  const ids = new Set(actors.map(([id]) => id));
  for (const message of messages)
    if (
      ![0, 1].includes(message.type) ||
      !ids.has(message.from) ||
      !ids.has(message.to) ||
      message.from === message.to ||
      !plain(message.message) ||
      message.activate ||
      message.wrap ||
      message.centralConnection
    )
      return unsupported(
        "sequence fragments, notes, activations or arrow notation",
      );
  const data = {
    schema_version: 1,
    diagram_type: "sequence",
    meta: {
      title: diagram.title,
      locale: "en",
      visual_preset: "blueprint",
      quality_profile: "showcase",
      viewBox: [
        Math.max(640, actors.length * 220 + 100),
        Math.max(480, messages.length * 70 + 240),
      ],
      legend: {
        mode: "auto",
        entries: {
          default: { label: "Solid message" },
          return: { label: "Dashed message" },
        },
      },
    },
    participants: actors.map(([id, actor]) => ({
      id,
      type: "backend",
      icon: "none",
      label: actor.description,
    })),
    messages: messages.map((message, index) => ({
      id: `message-${index}`,
      from: message.from,
      to: message.to,
      y: 170 + index * 70,
      label: message.message,
      ...(message.type === 1 ? { variant: "return" } : {}),
    })),
  };
  parseNativeDiagram(JSON.stringify(data), { location });
  return { status: "converted", source: JSON.stringify(data) };
}

/** A rejected conversion is not a rejected Mermaid diagram. Exceptions are errors. */
export async function convertMermaid(
  source,
  { location = "Mermaid diagram" } = {},
) {
  if (Buffer.byteLength(source) > 256 * 1024)
    throw new Error(`${location}: source exceeds 256 KiB`);
  let diagram;
  try {
    diagram = await parseMermaid(source);
  } catch (error) {
    throw new Error(`${location}: invalid Mermaid: ${error.message}`, {
      cause: error,
    });
  }
  const unsupported = (reason) => ({ status: "unsupported", reason });
  if (/%%\{|^---/m.test(source)) return unsupported("configuration directives");
  if (diagram.type === "sequence") return convertSequence(diagram, location);
  if (!/^flowchart/.test(diagram.type))
    return unsupported(`diagram family ${diagram.type}`);
  const { vertices, edges, groups } = diagram;
  if (vertices.length > 100 || edges.length > 200 || groups.length > 20)
    return unsupported(
      "conversion graph limits (100 nodes, 200 edges, 20 boundaries)",
    );
  if (/%%\{|^---|^\s*(?:classDef|class|style|linkStyle|click)\s/m.test(source))
    return unsupported("styling, interaction or configuration directives");
  if (!vertices.length) return unsupported("empty graph");
  for (const node of vertices) {
    if (
      !identifier(node.id) ||
      !["square", "round", "diamond"].includes(node.type) ||
      !["text", "string"].includes(node.labelType) ||
      (node.text ?? node.id).split(/\r?\n/).length > 2 ||
      !(node.text ?? node.id).split(/\r?\n/).every(plain) ||
      node.styles?.length ||
      node.classes?.length ||
      node.link ||
      Object.keys(node.props ?? {}).length
    )
      return unsupported(`node ${node.id}: shape, label, style or identifier`);
  }
  const nodeIds = new Set(vertices.map((node) => node.id));
  for (const edge of edges) {
    if (
      edge.type !== "arrow_point" ||
      !["normal", "dotted", "thick"].includes(edge.stroke) ||
      edge.length !== 1 ||
      edge.classes?.length ||
      edge.style?.length ||
      edge.start === edge.end ||
      !nodeIds.has(edge.start) ||
      !nodeIds.has(edge.end) ||
      (edge.text &&
        (!plain(edge.text) || !["text", "string"].includes(edge.labelType)))
    )
      return unsupported(
        "relationship shape, style, boundary endpoint or self-loop",
      );
  }
  for (const group of groups) {
    if (
      !identifier(group.id) ||
      !plain(group.title) ||
      group.classes?.length ||
      group.dir
    )
      return unsupported(
        "boundary label, identifier, style or local direction",
      );
  }

  const graph = new graphlib.Graph({ compound: true, multigraph: true })
    .setGraph({
      rankdir: diagram.direction,
      nodesep: 90,
      ranksep: 160,
      marginx: 90,
      marginy: 90,
    })
    .setDefaultEdgeLabel(() => ({}));
  for (const node of vertices)
    graph.setNode(node.id, {
      width: Math.max(
        180,
        (node.text ?? node.id).split(/\r?\n/)[0].length * 7 + 44,
        ((node.text ?? node.id).split(/\r?\n/)[1]?.length ?? 0) * 6 + 40,
      ),
      height: 90,
    });
  for (const group of groups) graph.setNode(group.id, { label: group.title });
  for (const group of groups)
    for (const id of group.nodes) graph.setParent(id, group.id);
  edges.forEach((edge, index) =>
    graph.setEdge(
      edge.start,
      edge.end,
      {
        width: (edge.text?.length ?? 0) * 7 + 24,
        height: 24,
        labelpos: "c",
      },
      `edge-${index}`,
    ),
  );
  layout(graph);
  if (
    graph
      .nodes()
      .some((id) => Math.max(graph.node(id).x, graph.node(id).y) > 18000)
  )
    return unsupported("native canvas limits");
  const descendants = (id, visiting = new Set()) => {
    if (visiting.has(id))
      throw new Error(`${location}: cyclic boundary membership`);
    visiting.add(id);
    return (graph.children(id) ?? []).flatMap((child) =>
      nodeIds.has(child) ? [child] : descendants(child, new Set(visiting)),
    );
  };
  const boundaryLayers = (id) =>
    1 +
    Math.max(
      0,
      ...(graph.children(id) ?? [])
        .filter((child) => !nodeIds.has(child))
        .map(boundaryLayers),
    );
  if (groups.some((group) => descendants(group.id).length === 0))
    return unsupported("empty boundary");
  const data = {
    schema_version: 1,
    diagram_type: "architecture",
    meta: {
      title: diagram.title,
      locale: "en",
      visual_preset: "blueprint",
      quality_profile: "showcase",
    },
    components: vertices.map((node) => {
      const box = graph.node(node.id);
      return {
        id: node.id,
        type: node.type === "diamond" ? "security" : "backend",
        label: (node.text ?? node.id).split(/\r?\n/)[0],
        ...((node.text ?? node.id).includes("\n")
          ? { sublabel: node.text.split(/\r?\n/)[1] }
          : {}),
        ...(node.type === "diamond" ? { tag: "Decision" } : {}),
        pos: [box.x - box.width / 2, box.y - box.height / 2],
        size: [box.width, box.height],
      };
    }),
    connections: edges.map((edge, index) => {
      return {
        id: `edge-${index}`,
        from: edge.start,
        to: edge.end,
        ...(edge.text ? { label: edge.text } : {}),
        ...(edge.stroke === "dotted" ? { variant: "dashed" } : {}),
        ...(edge.stroke === "thick" ? { variant: "emphasis" } : {}),
      };
    }),
    boundaries: groups.map((group) => ({
      kind: "region",
      label: group.title,
      wraps: descendants(group.id),
      pad: 30 * boundaryLayers(group.id),
    })),
  };
  parseNativeDiagram(JSON.stringify(data), { location });
  return { status: "converted", source: JSON.stringify(data) };
}
