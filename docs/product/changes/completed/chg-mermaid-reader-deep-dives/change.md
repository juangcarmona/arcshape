---
id: CHG-MERMAID-READER-DEEP-DIVES
type: product-change
title: Keep Mermaid in the reader and link separate Archify deep dives
status: applied
base-revision: '820e6a28560857a9bb3bcd93740fc647490f0ff6'
operations:
  add: []
  modify:
    - FR-INTERACTIVE-DIAGRAMS
    - FR-CLI-COMMANDS
    - FR-ASSISTED-WORKFLOWS
    - UC-CREATE-ARCHITECTURE-DIAGRAMS
  remove: []
---

## Problem

Automatically replacing a Mermaid diagram with an embedded Archify view changes the presentation the maintainer wants in the main documentation.

## Intended Product Outcome

Render Mermaid in both Markdown and the main generated documentation. Add a separate Archify deep-dive page and a discreet new-tab link only when the diagram can be represented faithfully. Preserve the original source and compatibility with explicitly native documents.

## Rationale

The maintainer's latest direction is to keep the familiar Mermaid presentation and use Archify for optional deeper exploration.

## Affected Product Areas

Diagram authoring, reader presentation, deterministic publication and AI guidance. This refines the already applied Mermaid-first change; it does not revert its source-readability or native-preview guarantees.

## Open Questions

None.

## Product Acceptance

The primary rendered figure is Mermaid. Supported diagrams have one “Deep dive with Archify” link that opens a separate interactive page. Unsupported diagrams stay Mermaid without an unavailable link. Generating a site does not rewrite authored diagrams.

## Out of Scope

Universal conversion, embedding Archify in place of Mermaid, new external publication integrations, and merge/release acceptance.
