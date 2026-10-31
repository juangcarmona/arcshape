<!-- pdac-scope: cited -->

# Design

## Context

See proposal.md. The current reference parser requires SVG; the generator already renders sanitized native SVG in a network-blocked Chromium process. The four-file default extends that boundary without a renderer dependency.

## Goals / Non-Goals

Generate a portable PNG while preserving SVG-backed documents, native HTML and existing isolation. Do not introduce a new source authority, automatic migration, Azure connector or lossy image export.

## Decisions

- Resolve image/source pairs with either .svg or .png and derive same-stem SVG, PNG and Markdown paths. Validate each real path and reject symlinks.
- Reuse the existing browser only during explicit generation. Rasterize sanitized SVG in light theme on an opaque white background at up to 2x logical resolution, capped at 8192 pixels per axis and 16 million total pixels; reject files beyond 16 MiB.
- Store source, vector and PNG-content SHA-256 provenance in a standard PNG tEXt chunk with standard CRC32 checksums. Keep Node 22.0 compatibility without a new dependency; cross-check chunk CRCs against Node's native implementation in tests. Verify PNG structure, chunk integrity and provenance without rerasterization. This avoids platform-font differences making committed PNGs falsely stale.
- Stage every companion before writing. Refuse authored/edited PNGs. PNG-selected references require PNG; SVG-selected legacy bundles may omit it. The default generation command adds PNG even when the current reference is SVG; site builds never migrate.
- HTML still uses sanitized vector/static or sandboxed interactive output, publishing the validated PNG alongside dedicated exports. Native content and parent-page permissions do not change.

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:ac09dcb4dd5f8d437006a51f654c3f1b3d218dc223ca1ebb0a67311bdfe6b0ed" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ff3d03ebe93668cb0392a672fe63b9925404fab9dc2fb7891931f1f5d2ea799d" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:1ec5f68cf7a73bff2e6d29613b060430717f21a418e0abf353fc9ec349de4e02" -->

## Risks / Trade-offs

Raster zoom is finite; retain SVG. Large canvases are capped; measure gallery previews. A valid parser/hash does not establish semantic correctness; inspect screenshots. PNG introduces binary Git diffs, so source and SVG remain reviewable.

## Migration Plan

Apply the product change already approved by the maintainer; update tooling/guidance; explicitly migrate the canonical architecture image references and generate the four companions. Regeneration handles stale but intact generated images; edited images require manual resolution. Rollback restores image references to SVG without discarding canonical JSON. Preserve all old formats.

