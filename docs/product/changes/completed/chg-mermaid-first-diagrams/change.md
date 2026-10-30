---
id: CHG-MERMAID-FIRST-DIAGRAMS
type: product-change
title: Keep diagrams readable in Markdown with Mermaid-first authoring
status: applied
base-revision: '39cc95b'
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

Native JSON fences expose source data instead of a diagram in Markdown readers. The existing native-first guidance makes documentation depend on building the ArcShape site.

## Intended Product Outcome

Standard Mermaid is the default editable diagram source. ArcShape enhances its documented supported subset with the existing interactive experience and renders valid unsupported syntax through Mermaid. Native-only diagrams use local JSON sidecars with generated SVG previews. Existing native fences remain supported.

## Rationale

One editable source must support readable repository documentation and richer publication. Fallback must preserve semantics; input and renderer errors must stay visible.

## Affected Product Areas

Diagram authoring, AI guidance, deterministic generation and readable Markdown. The inspected C4, reader, publication, external-connection and capability-distribution contracts retain their existing meaning. No new external-system upload or interaction guarantee is introduced.

## Open Questions

None.

## Product Acceptance

Readers see Mermaid diagrams or generated SVG previews in compatible Markdown viewers. Generated sites enhance supported Mermaid without duplicate authored sources. Unsupported semantics, old native fences, static reading and isolated interaction remain usable. Missing/stale native previews can be detected explicitly.

## Out of Scope

Universal Mermaid conversion, new diagram semantics, new hosted services, automatic consumer migration, external image uploads, and release or deployment acceptance.
