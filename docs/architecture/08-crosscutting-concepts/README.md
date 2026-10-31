---
title: Cross-cutting concepts
arc42-section: "08"
description: Concepts and rules that affect multiple building blocks.
---

# 8. Cross-cutting concepts

## Ownership and authority

Product intent, implementation behavior, quality constraints, and architecture records have separate owners. The ProductShape model states what ArcShape should do; architecture Markdown explains how this repository realizes it. Generated readers and published snapshots are projections, not alternate sources of truth.

<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->

## Security and privacy

Repository setup, validation, site generation, session state, and Obsidian sync operate locally. Confluence sync sends the selected architecture Markdown to the explicitly configured space and parent page when run without `--dry-run`; credentials are read from environment variables and are not persisted. Initialization refuses to overwrite differing authored files and refuses to write through symlinked paths. Assistant skills are local Markdown instructions; external AI providers have their own data handling policies.

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

## Diagram execution and publication

Native diagrams use one canonical JSON source with generated SVG, PNG and fenced Mermaid Markdown companions. The document's image/source pair displays PNG in Markdown and resolves to the native viewer in interactive publication. Explicit generation validates Mermaid syntax and records source/content hashes; publication checks freshness without rewriting assets. Generated companions do not become duplicate reader pages. Existing Mermaid sources remain supported through the bounded parser/layout adapter. References are confined to the real documentation root; symlink targets and modified generated output are rejected. Native rendering still uses the pinned schema, network-blocked build browser, sanitized SVG and isolated runtime.

Portable PNG export reuses the same network-blocked browser to rasterize sanitized light-theme SVG within bounded dimensions. PNG text metadata binds source, vector and image-content hashes; checks validate the committed image rather than reproducing pixels on each operating system. Legacy SVG-only bundles remain valid without migration.

Interactive pages execute the viewer in `sandbox="allow-scripts"` iframes, without same-origin access. Dedicated pages keep the same boundary by assigning inert viewer data to a sandboxed `srcdoc` frame. Both wrappers validate message source windows and bounded message shapes; they accept no arbitrary URLs or DOM commands. CSP restricts scripts to generated hashes and blocks network connections. Static images remain available without JavaScript.

Publication stages the entire directory before replacing intact ArcShape-owned output. Its file-hash manifest detects modified or unrelated files; output cannot overlap the authored documentation or traverse symlinks. Snapshot generation retains the existing single-file contract. See [ADR-0002](../09-architecture-decisions/ADR-0002-isolate-native-diagram-viewers.md) and the [fictional family gallery](diagram-gallery.md).

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->

## Observability and operations

The CLI reports created, unchanged, updated, orphaned, and conflicting files or pages for sync. Initialization is repeatable and has no persistent service state. Analysis sessions, sync baselines, and capability ownership are stored locally under `.arcshape/`.
