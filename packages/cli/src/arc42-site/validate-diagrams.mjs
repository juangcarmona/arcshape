#!/usr/bin/env node
import { resolve } from "node:path";
import { loadDocs } from "./loadDocs.mjs";
import { extractMermaidSources, validateDiagramTitles } from "./render.mjs";

const docsDir = resolve(process.argv[2] ?? "docs/architecture/arc42");
const docs = await loadDocs(docsDir);
const problems = [];
let count = 0;

for (const document of [docs.readme, ...docs.sections]) {
  const sources = extractMermaidSources(document.body);
  const issues = validateDiagramTitles(sources);
  count += sources.length;
  problems.push(...issues.map((issue) => `${document.file}: ${issue}`));
}

if (problems.length > 0) {
  process.stderr.write(
    `arc42-snapshot: diagram contract failed:\n  - ${problems.join("\n  - ")}\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `arc42-snapshot: ${count} Mermaid diagram(s) have accessible titles\n`,
);
