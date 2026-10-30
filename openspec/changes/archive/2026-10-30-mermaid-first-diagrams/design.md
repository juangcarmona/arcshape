<!-- pdac-scope: cited -->
# Design

## Context

See proposal and ADR-0003. The current renderer has separate per-document Mermaid/native arrays and a reusable sandboxed native widget.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

## Goals / Non-Goals

Preserve one authored source, complete diagram semantics, existing output modes and trust boundaries. No universal conversion, sequence adapter, viewer redesign or vendor fork.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

## Decisions

Use Mermaid `mermaidAPI.getDiagramFromText` to validate and obtain the flow database. Use pinned dagre-d3-es graphlib and layout for deterministic coordinates in all orientations. Build native architecture components/connections/boundaries, then run existing native validation/rendering with its showcase auto-label and routing profile. Preserve two-line quoted labels as title/detail lines. The workflow schema caps columns at five and cannot represent arbitrary orientations cheaply.

Support text rectangle/rounded/diamond nodes, directed normal edges, labels, cycles, directions TB/TD/LR/BT/RL and representable subgraphs. Preserve decision meaning through a tag/type. Reject conversion eligibility for styling, links, directives, markdown/HTML labels, unknown shapes/edges, boundary edges or unsupported geometry. Whole-diagram fallback only. All source is parsed before eligibility; exceptions are not unsupported results.

Retain separate per-document arrays for legacy native fences and Mermaid slots. Every Mermaid slot contains Mermaid SVG. Compatible sources additionally create native artifacts for dedicated pages. renderMarkdown appends one new-tab deep-dive link without an iframe or duplicate figure. Hash source-relative document path plus diagram identity, not absolute worktree paths. Export the original Mermaid as source.mmd and retain it next to the dedicated page without adding a disclosure panel to the main reader.

Use `--archify-deep-dives auto|off` on folder builds. Default auto; off skips derived pages. Snapshot output always uses Mermaid for Mermaid fences and never creates separate pages.

Pair `![Title](./diagrams/name.svg)` with the immediately following `<!-- arcshape-diagram-source: ./diagrams/name.archify.json -->`. Require local relative paths under real docs root, no symlink escape, one association, distinct JSON/SVG paths, and safe native data. Replace only the paired image with the native figure at build time. `arcshape site previews [--docs dir] [--check]` generates previews explicitly or checks regenerated sanitized SVG equality. Existing mismatching non-generated SVGs are not overwritten. Site builds verify freshness and do not modify source files.

Preserve viewer sandbox/CSP, sanitizer, bounded input and static fallback. No new unsafe access is enabled by conversion.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

## Risks / Trade-offs

Parser/database and layout APIs can change: pin direct dependencies and test semantic fixtures. Native router limits can surface as build errors: do not hide renderer defects behind fallback. Subgraphs that cannot preserve membership/labels use Mermaid. Native preview freshness adds an explicit generation step.

## Migration Plan

Migrate ArcShape's reviewed simple native architecture/workflow diagrams to Mermaid. Keep advanced families through generated SVG plus JSON sidecars. Do not rewrite external repositories. Update packaged guidance and regenerate installed projections. Rollback can disable deep-dive generation or restore sources from version control; old fences still work.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->
