---
name: arc-c4
description: Create and maintain evidence-grounded C4-style architecture diagrams in Markdown, with native interactive output or Mermaid. Use when a maintainer asks for context, container, component, or code views.
---

# ArcShape C4 diagram workflow

1. Inspect current documentation, repository structure, runtime configuration, deployment, interfaces, and tests. Ask the maintainer about external actors or intended boundaries that evidence cannot establish.
2. Choose the smallest useful C4 level: context, container, component, or code. Do not produce every level by default.
3. For new context, container or component views, read the [diagram guide](../arc-architecture/references/diagrams/README.md). Author native architecture JSON with explicitly labeled abstraction levels and boundaries; generate SVG, PNG and fenced Mermaid Markdown companions with `arcshape site diagrams`. Markdown displays the PNG and interactive publication displays the native viewer. Keep Mermaid `C4Context`, `C4Container`, or `C4Component` when strict C4 notation or unsupported features matter. Keep names and relationship labels concise.
4. Ground nodes and relationships in evidence. Mark inferred boundaries and unknown relationships for review; do not imply that a planned component exists.
5. Preserve existing correct diagrams and propose focused edits. When evidence changes, update only affected nodes, relationships, and adjacent explanation; leave unrelated authored content unchanged and show the diff. Do not overwrite diagrams from external sources without review.
6. Run `arcshape site build` and inspect the rendered diagram. For native output, also build with `--format interactive --out <new-directory>` and inspect the embed and dedicated page at desktop and narrow widths. Capture screenshots before committing visual changes. Report render failures and unresolved assumptions; invalid native input is not a reason to silently switch engines.
