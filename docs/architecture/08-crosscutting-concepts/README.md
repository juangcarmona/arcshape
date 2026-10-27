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

Native diagram JSON stays in canonical Markdown. The adapter validates the pinned family schema and rejects resource-bearing inputs before rendering. The package contains a minimal Archify subset with file hashes and attribution; the build browser blocks network requests and exports a sanitized static SVG. This is trusted local build execution, not a sandbox for third-party renderer plugins.

Interactive pages execute the viewer in `sandbox="allow-scripts"` iframes, without same-origin access. Dedicated pages keep the same boundary by assigning inert viewer data to a sandboxed `srcdoc` frame. Both wrappers validate message source windows and bounded message shapes; they accept no arbitrary URLs or DOM commands. CSP restricts scripts to generated hashes and blocks network connections. Static images remain available without JavaScript.

Publication stages the entire directory before replacing intact ArcShape-owned output. Its file-hash manifest detects modified or unrelated files; output cannot overlap the authored documentation or traverse symlinks. Snapshot generation retains the existing single-file contract. See [ADR-0002](../09-architecture-decisions/ADR-0002-isolate-native-diagram-viewers.md) and the [fictional family gallery](diagram-gallery.md).

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->

## Observability and operations

The CLI reports created, unchanged, updated, orphaned, and conflicting files or pages for sync. Initialization is repeatable and has no persistent service state. Analysis sessions, sync baselines, and capability ownership are stored locally under `.arcshape/`.
