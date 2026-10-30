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

JSON fences render as code in Markdown viewers. The maintainer approved Mermaid-first authoring and native-only SVG previews through CHG-MERMAID-FIRST-DIAGRAMS. The maintainer then approved keeping Mermaid in the main web reader and linking separate Archify pages through CHG-MERMAID-READER-DEEP-DIVES. The current build already isolates native viewers and sanitizes static output. A local experiment parsed a flowchart with Mermaid 12.2.0, laid out a cycle with Dagre and rendered it through the existing native architecture renderer.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

## Decision

Propose one standard Mermaid source for normal authoring. Parse the entire source with Mermaid's parser. Render Mermaid in the main reader. Derive a separate Archify deep-dive page for a bounded compatible flowchart subset, using Dagre positions, native boundaries and the native architecture renderer's showcase routing/label placement. Add one new-tab link beneath the Mermaid figure. The workflow renderer's six-column contract cannot preserve general orientations; use the architecture renderer for flowcharts too. Decision nodes retain a decision tag rather than an exact diamond outline.

Classify whole diagrams as converted or unsupported. Invalid source and adapter/render exceptions fail with location; valid unsupported sources have no deep-dive link. Retain the original source beside generated pages as source.mmd. Use `--archify-deep-dives off` to disable optional pages. Snapshot builds render Mermaid without generating deep dives. Preserve the snapshot and isolated interactive publication contracts.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->

For native-only diagrams, associate a local SVG image with an immediately following `arcshape-diagram-source` comment naming a JSON sidecar. Resolve both within the real documentation root, reject ambiguous/unsafe references, and validate native data through the existing adapter. `site previews` explicitly writes generated SVGs; `site previews --check` detects stale output. Builds only read source files.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

## Alternatives considered

- Replace Mermaid with an embedded native viewer: rejected after maintainer review; Mermaid stays the main presentation.
- Keep JSON fences as default: fails Markdown readability.
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
