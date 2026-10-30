---
id: CHG-NATIVE-DIAGRAM-BUNDLES
type: product-change
title: Make native diagram bundles the default authoring contract
status: applied
base-revision: '95195afe1f24e00970c7ebc8d1e88ad41d208c9f'
operations:
  add: []
  modify:
    - FR-INTERACTIVE-DIAGRAMS
    - FR-CLI-COMMANDS
    - FR-ASSISTED-WORKFLOWS
    - FR-READER-VIEW
    - UC-CREATE-ARCHITECTURE-DIAGRAMS
  remove: []
---

## Problem

Mermaid-first authoring depends on a Markdown viewer's Mermaid support and on the native converter's limited feature coverage. Native-only SVG/JSON pairs already provide the preferred Markdown and rich HTML experience, but are not the package's default diagram contract and have no supported Mermaid companion workflow.

## Intended Product Outcome

Make native diagram bundles the default for supported diagram creation and maintenance. Keep the authoritative Archify JSON, generated SVG and supported generated Mermaid companion together. Markdown shows the SVG; interactive ArcShape HTML shows the compact native viewer. Self-contained HTML remains readable through native static SVG. Existing Mermaid and native documents remain supported.

## Rationale

The Mermaid companion is a standard `.md` document containing a fenced `mermaid` block, as explicitly requested by the maintainer. It is not a `.mmd` file.

The maintainer explicitly prefers the section 08 gallery pattern for all diagrams and package authoring commands. A declared canonical source and generated companions avoid three diverging editable versions while providing portable Markdown images, rich native HTML and reusable Mermaid.

## Affected Product Areas

Native diagram authoring, AI skills and diagram commands, deterministic rendering/export/freshness checks, reader presentation, and explicit migration of ArcShape's own architecture diagrams. The product default changes across supported native families, not just for the gallery.

## Open Questions

None.

## Product Acceptance

The default supported native workflow produces a canonical native JSON source, generated SVG and faithful Mermaid companion where the export matrix supports it. Markdown shows the image without requiring Mermaid support. ArcShape folder HTML resolves the native source and shows the compact widget with full-page access. Generation and check operations expose stale, missing, modified or unsupported companions; the assistant inspects and compares the representations. Native JSON is the editable source for native bundles; derived files do not become competing authorities. Existing Mermaid stays supported and required semantics are never discarded to manufacture a bundle. The authored documentation is migrated only through explicit, reviewed edits, not by upgrading the package or building a site.

## Out of Scope

Universal lossless translation between every native and Mermaid feature, maintaining three independently editable sources, rewriting third-party project documentation without identifying the target, and implementation, merge or release acceptance.
