import { parseNativeDiagram } from "./native-diagrams.mjs";

const quote = (text) =>
  '"' +
  String(text)
    .replace(/&/g, "#38;")
    .replace(/"/g, "#quot;")
    .replace(/`/g, "#96;") +
  '"';
const label = (node) =>
  [node.label ?? node.title ?? node.name ?? node.id, node.sublabel, node.tag]
    .filter(Boolean)
    .join("\n");
const details = (node) => {
  const result = [label(node)];
  if (node.kind) result.push(node.kind);
  for (const a of node.attributes ?? [])
    result.push(
      [a.name, a.type, a.key, a.references, a.visibility]
        .filter(Boolean)
        .join(" · "),
    );
  for (const m of node.methods ?? [])
    result.push(
      `${m.name}(${m.parameters ?? ""}): ${m.returns ?? "void"}${m.abstract ? " [abstract]" : ""}`,
    );
  return result.join("\n");
};

/** A semantic view, not a promise of matching native styling or layout. */
export function exportNativeMermaid(source) {
  const data = parseNativeDiagram(source);
  const title = data.meta.title.replace(/[\r\n]/g, " ");
  const cards = (data.cards ?? []).map(
    (c) => `${c.title}\n${(c.items ?? []).join("\n")}`,
  );
  if (data.diagram_type === "sequence") {
    if (
      (data.segments ?? []).length ||
      (data.messages ?? []).some(
        (m) => typeof m.from !== "string" || typeof m.to !== "string",
      )
    )
      throw new Error(
        "Mermaid export does not support sequence segments or endpoint objects",
      );
    const ids = new Map(data.participants.map((p, i) => [p.id, `p${i}`]));
    const lines = ["sequenceDiagram", `  accTitle: ${title}`];
    for (const p of data.participants) {
      if (/[\r\n;]|(?:^|\s)(?:end)(?:\s|$)/i.test(label(p)))
        throw new Error("unsupported Mermaid participant label");
      lines.push(
        `  participant ${ids.get(p.id)} as ${label(p).replace(/\n/g, " · ")}`,
      );
    }
    for (const m of [...data.messages].sort((a, b) => a.y - b.y)) {
      const variant = m.variant ?? "default";
      const meaning = data.meta.legend?.entries?.[variant]?.label;
      if (/[\r\n]|(?:^|\s)end(?:\s|$)/i.test(m.label))
        throw new Error("unsupported Mermaid sequence message label");
      lines.push(
        `  ${ids.get(m.from)}${["return", "dashed"].includes(variant) ? "-->>" : "->>"}${ids.get(m.to)}: ${m.label}${meaning ? ` [${meaning}]` : ""}`,
      );
      if (m.note)
        lines.push(
          `  Note over ${ids.get(m.from)},${ids.get(m.to)}: ${m.note.replace(/\n/g, " · ")}`,
        );
    }
    for (const card of cards)
      lines.push(
        `  Note over ${ids.values().next().value},${[...ids.values()].at(-1)}: ${card.replace(/\n/g, " · ")}`,
      );
    return lines.join("\n") + "\n";
  }
  let nodes,
    edges,
    groups = [];
  switch (data.diagram_type) {
    case "architecture":
      nodes = data.components;
      edges = data.connections ?? [];
      groups = (data.boundaries ?? []).map((g, i) => ({
        id: `g${i}`,
        label: g.label,
        nodes: g.wraps,
      }));
      break;
    case "workflow":
      nodes = data.nodes;
      edges = data.edges ?? [];
      groups = (data.lanes ?? []).map((g, i) => ({
        id: `g${i}`,
        label: g.label,
        nodes: nodes.filter((n) => n.lane === g.id).map((n) => n.id),
      }));
      break;
    case "dataflow":
      nodes = data.nodes;
      edges = data.flows ?? [];
      groups = (data.stages ?? []).map((g, i) => ({
        id: `g${i}`,
        label: g.label,
        nodes: nodes.filter((n) => n.stage === i).map((n) => n.id),
      }));
      break;
    case "lifecycle":
      nodes = data.states;
      edges = data.transitions ?? [];
      break;
    case "tree":
      nodes = data.nodes;
      edges = nodes
        .filter((n) => n.parent)
        .map((n) => ({ from: n.parent, to: n.id, label: "parent" }));
      break;
    case "class":
      nodes = data.types;
      edges = (data.relationships ?? []).map((e) => ({
        ...e,
        label: [e.kind, e.label].filter(Boolean).join(": "),
      }));
      break;
    case "erd":
      nodes = data.entities;
      edges = (data.relationships ?? []).map((e) => ({
        ...e,
        label: [e.label, `${e.fromCardinality} → ${e.toCardinality}`]
          .filter(Boolean)
          .join(" · "),
      }));
      break;
    case "timeline":
      nodes = [...data.events]
        .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
        .map((e) => ({
          ...e,
          label: [
            e.title,
            e.at,
            data.lanes?.find((l) => l.id === e.lane)?.label,
            e.kind,
          ]
            .filter(Boolean)
            .join("\n"),
        }));
      edges = nodes
        .slice(1)
        .map((n, i) => ({ from: nodes[i].id, to: n.id, label: "next event" }));
      break;
    case "waterfall":
      nodes = data.spans.map((s) => ({
        ...s,
        label: [
          s.name,
          s.service,
          `${s.start}–${s.end} ${data.meta.unit ?? ""}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }));
      edges = nodes
        .filter((n) => n.parent)
        .map((n) => ({ from: n.parent, to: n.id, label: "contains span" }));
      break;
    default:
      throw new Error(
        `Unsupported Mermaid export family: ${data.diagram_type}`,
      );
  }
  if (nodes.length > 150 || edges.length > 300)
    throw new Error("Mermaid export graph exceeds supported limits");
  const ids = new Map(nodes.map((n, i) => [n.id, `n${i}`]));
  const lines = [
    "flowchart LR",
    `  accTitle: ${title}`,
    `  %% Semantic projection of native ${data.diagram_type}; native layout and effects are not Mermaid notation.`,
  ];
  const emitted = new Set();
  const nodeLine = (id) => {
    if (!ids.has(id))
      throw new Error(`Mermaid export references unknown node: ${id}`);
    emitted.add(id);
    const node = nodes.find((n) => n.id === id);
    const text = [details(node), node.type ? `Type: ${node.type}` : ""]
      .filter(Boolean)
      .join("\n");
    return `  ${ids.get(id)}[${quote(text)}]`;
  };
  groups = groups.filter((g) => g.nodes?.length);
  for (const g of groups)
    for (const h of groups) {
      const overlap = g.nodes.filter((n) => h.nodes.includes(n));
      if (
        g !== h &&
        overlap.length &&
        overlap.length !== g.nodes.length &&
        overlap.length !== h.nodes.length
      )
        throw new Error(
          "Overlapping native boundaries have no faithful Mermaid export",
        );
    }
  const renderGroup = (g) => {
    lines.push(`  subgraph ${g.id}[${quote(g.label)}]`);
    const children = groups.filter(
      (h) =>
        h !== g &&
        h.nodes.length < g.nodes.length &&
        h.nodes.every((n) => g.nodes.includes(n)) &&
        !groups.some(
          (k) =>
            k !== g &&
            k !== h &&
            k.nodes.length < g.nodes.length &&
            k.nodes.length > h.nodes.length &&
            h.nodes.every((n) => k.nodes.includes(n)) &&
            k.nodes.every((n) => g.nodes.includes(n)),
        ),
    );
    for (const child of children) renderGroup(child);
    for (const id of g.nodes) if (!emitted.has(id)) lines.push(nodeLine(id));
    lines.push("  end");
  };
  for (const g of groups.filter(
    (g) =>
      !groups.some(
        (h) =>
          h !== g &&
          h.nodes.length > g.nodes.length &&
          g.nodes.every((n) => h.nodes.includes(n)),
      ),
  ))
    renderGroup(g);
  for (const n of nodes) if (!emitted.has(n.id)) lines.push(nodeLine(n.id));
  for (const e of edges) {
    if (!ids.has(e.from) || !ids.has(e.to))
      throw new Error("Unsupported Mermaid relationship endpoint");
    const meaning = data.meta.legend?.entries?.[e.variant ?? "default"]?.label;
    const text = [e.label, e.role, meaning].filter(Boolean).join(" · ");
    const arrow =
      e.variant === "dashed"
        ? "-.->"
        : e.variant === "emphasis"
          ? "==>"
          : "-->";
    lines.push(
      `  ${ids.get(e.from)} ${arrow}${text ? `|${quote(text)}|` : ""} ${ids.get(e.to)}`,
    );
  }
  for (const [i, card] of cards.entries())
    lines.push(`  note${i}[${quote(card)}]`);
  return lines.join("\n") + "\n";
}
