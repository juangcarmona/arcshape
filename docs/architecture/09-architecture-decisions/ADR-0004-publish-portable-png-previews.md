---
id: ADR-0004
title: Publish portable PNG previews alongside vector diagrams
status: Accepted
date: "2026-10-31"
deciders:
  - Repository Maintainer
---

<!-- markdownlint-disable-next-line MD025 -->
# ADR-0004: Publish portable PNG previews alongside vector diagrams

## Context

An adopter reports that the Azure Repos Markdown surface does not display the SVG previews shipped by 0.3.0. The maintainer approved PNG as the general Markdown default while retaining JSON, SVG, Mermaid and native HTML, and authorized continuation through release preparation. No live Azure DevOps verification is claimed.

## Decision

Use portable PNG for new Markdown image/source pairs and retain SVG for vector quality. The existing build browser rasterizes sanitized light-theme SVG with an opaque background and bounded dimensions. JSON remains authoritative and the HTML reader still selects its static or sandboxed native presentation.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->

Record source, vector and image-content hashes inside a standard PNG text chunk. Validate the committed PNG's checksums, dimensions and provenance, not freshly rasterized bytes: system fonts and rasterization can vary across supported operating systems. Reuse Node and the packaged browser rather than adding an image dependency. Keep existing SVG-only bundles valid and require explicit migration of authored image references.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->

## Alternatives considered

- SVG only: retains the reported Markdown compatibility failure.
- PNG only: loses arbitrary vector zoom and the existing source/publication contract.
- JPEG or lossy encoding: risks artifacts around text and lines.
- Exact raster byte comparison on every host: can mark intact assets stale because of platform-specific rasterization.
- A separate per-image manifest: adds another companion when PNG text metadata can carry the same provenance.

## Consequences

- Positive: Markdown displays a conventional image without changing the native HTML experience.
- Positive: explicit generation protects authored output and keeps one diagram authority.
- Negative: PNG adds binary repository content and finite zoom; large diagrams may be downscaled to meet raster limits.
- Neutral: PNG is an additional generated artifact, not a new diagram engine or external documentation connector.

## References

- [Issue #120](https://github.com/juangcarmona/arcshape/issues/120)
- [Diagram bundles](../../diagrams.md)
- [Raster provenance implementation](../../../packages/cli/src/arc42-site/native-png.mjs)

