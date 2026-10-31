---
id: ADR-0003
title: Enhance Mermaid sources with native diagrams
status: Proposed
date: "2026-10-30"
deciders: []
---

<!-- markdownlint-disable-next-line MD025 -->
# ADR-0003: Enhance Mermaid sources with native diagrams

## Context

JSON fences render as code in Markdown viewers. The maintainer approved Mermaid-first authoring and native-only SVG previews through CHG-MERMAID-FIRST-DIAGRAMS. The maintainer then approved keeping Mermaid in the main web reader and linking separate Archify pages through CHG-MERMAID-READER-DEEP-DIVES. The maintainer subsequently approved CHG-MERMAID-NATIVE-PUBLICATION: retain Mermaid authoring but present native diagrams inside generated documentation wherever faithfully supported. This replaces the earlier deep-dive-only presentation proposal. The current build already isolates native viewers and sanitizes static output. A local experiment parsed a flowchart with Mermaid 12.2.0, laid out a cycle with Dagre and rendered it through the existing native architecture renderer.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->

## Decision

The maintainer approved CHG-NATIVE-DIAGRAM-BUNDLES as the next refinement: native JSON is now the default diagram authority, with generated SVG and standard fenced Mermaid Markdown companions. The image/source pair is the normal Markdown/reader integration, rather than an exception for native-only features. `site diagrams` generates and checks coordinated assets; provenance detects source drift and edited companions. Generated companion-only Markdown is excluded from duplicate reader navigation. Unsupported projections are reported. Mermaid alternatives communicate semantic structure, not identical native styling.

The following compatibility decision remains applicable to existing Mermaid-authored diagrams:

Retain one standard Mermaid source for existing or explicitly Mermaid-authored documents. Parse the entire source with Mermaid's parser. Derive native publication input in memory for a bounded compatible flowchart subset, using Dagre positions, native boundaries and the native architecture renderer's showcase routing/label placement. Render the derived native diagram in the document: sanitized SVG for self-contained HTML, or the isolated compact viewer and its full-page link for folder output. Convert simple plain-participant sequences with solid/dashed filled-arrow messages; retain the complete Mermaid when unsupported semantics appear. The workflow renderer's six-column contract cannot preserve general orientations; use the architecture renderer for flowcharts too. Decision nodes retain a decision tag rather than an exact diamond outline.

Classify whole diagrams as converted or unsupported. Invalid source and adapter/render exceptions fail with location; valid unsupported sources remain Mermaid. Retain the original source beside generated pages as source.md (a fenced Mermaid Markdown document). Use `--diagram-engine mermaid` to select Mermaid-only publication. Snapshot builds embed native SVG where conversion succeeds. Preserve the snapshot and isolated interactive publication contracts.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->

For native-only diagrams, associate a local SVG image with an immediately following `arcshape-diagram-source` comment naming a JSON sidecar. Resolve both within the real documentation root, reject ambiguous/unsafe references, and validate native data through the existing adapter. `site previews` explicitly writes generated SVGs; `site previews --check` detects stale output. Builds only read source files.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->

## Alternatives considered

- Keep Mermaid as the main web figure with optional deep dives: the maintainer replaced this earlier proposal with native-first publication.
- Keep inline JSON fences as default: fails Markdown readability. External JSON paired with SVG avoids this problem.
- Generate authored Mermaid from native JSON: adds another conversion direction and review burden.
- Maintain two editable sources: permits drift.
- Implement a Mermaid grammar or graph layout: duplicates installed machinery.
- Load a runtime CDN or invoke an LLM at build time: loses offline, deterministic publication.

## Consequences

- Compatible Markdown readers display standard sources; native-only documents display images.
- Mermaid parser and Dagre APIs are pinned integration dependencies with semantic fixtures.
- Unsupported syntax remains Mermaid. Enhancement covers no sequence fragments or C4-specific DSL.
- Old JSON fences remain supported without source rewrites.
- Generated previews need a freshness check. Viewer isolation and sanitization remain unchanged.

## References

- [Issue #117](https://github.com/juangcarmona/arcshape/issues/117)
- [Execution plan](../../delivery/mermaid-first-diagrams/plan.md)
- [Viewer isolation proposal](ADR-0002-isolate-native-diagram-viewers.md)
- [Applied Product Change](../../product/changes/completed/chg-mermaid-first-diagrams/change.md)
