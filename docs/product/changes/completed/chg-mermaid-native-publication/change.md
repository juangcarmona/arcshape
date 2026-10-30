---
id: CHG-MERMAID-NATIVE-PUBLICATION
type: product-change
title: Publish native ArcShape diagrams from canonical Mermaid
status: applied
base-revision: '56120df7cf07643bfba63d470c7c22d9814c5b3a'
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

Keeping Mermaid as the primary generated web figure with only an optional native deep-dive link does not deliver the native diagram experience the maintainer wants in ArcShape documentation. Native JSON-only authoring does not provide a canonical Mermaid diagram for ordinary Mermaid-capable Markdown viewers.

## Intended Product Outcome

Authors maintain Mermaid in Markdown. ArcShape publication automatically presents a faithful native representation wherever supported, with full Mermaid fallback otherwise. Interactive folder output embeds the compact native viewer and provides a dedicated page. Self-contained HTML presents native SVG without external runtime dependencies. The original Markdown stays unchanged and no second editable JSON diagram is required for converted sources.

## Rationale

The maintainer explicitly clarified that Markdown compatibility and native web presentation are complementary requirements. This replaces the separate-deep-dive-only presentation decision without abandoning single-source authoring or compatibility.

## Affected Product Areas

Diagram authoring, generated reader presentation, deterministic publication, supported conversion coverage and AI-assisted documentation updates.

## Open Questions

None.

## Product Acceptance

A Mermaid-capable Markdown viewer sees the authored Mermaid. For bounded flowchart and simple sequence subsets, ArcShape publication shows native diagrams in place of Mermaid; interactive publication retains selection, responsive embedding and full-page exploration. Self-contained HTML has a readable native SVG. Unsupported families or constructs remain complete Mermaid diagrams rather than losing meaning. The supported conversion matrix is explicit and distinct from native renderer coverage. Builds do not change Markdown sources or require maintainers to edit duplicate native data. Existing native sources remain supported; explicit Mermaid-only publication remains possible.

## Out of Scope

Universal Mermaid conversion, inventing semantics, automated rewrites during package installation, new external hosting services, changing the target project's files without identifying it, and implementation, merge or release acceptance.
