---
id: ADR-0002
title: Isolate native diagram viewers and retain static snapshots
status: Proposed
date: "2026-10-27"
deciders: []
---

<!-- markdownlint-disable-next-line MD025 -->
# ADR-0002: Isolate native diagram viewers and retain static snapshots

## Context

The maintainer approved bringing the compact interactive prototype into ArcShape while preserving Mermaid and single-file documentation. The prototype depended on a separate Archify checkout and same-origin access to its viewer. Shipping those assumptions would couple consumers to a development machine and give diagram code access to the reader.

## Decision

Propose storing typed native JSON in Markdown fences and bundling a pinned Archify renderer subset. Build both representations from that source: static SVG for the default snapshot, and an explicit directory with embedded and dedicated interactive viewers. Preserve existing Mermaid without automatic conversion.

Run viewer scripts only inside opaque-origin iframes, including on dedicated pages. Exchange bounded selection, theme and scrolling messages with the trusted wrapper. Publish no directly navigable raw runtime artifact. Retain visible static output if scripting is disabled or startup fails. Include vendor integrity and MIT attribution without embedded font or third-party brand payloads.

## Alternatives considered

- Keep the PoC's external checkout and same-origin iframe: not portable and does not enforce the parent-document boundary.
- Load a CDN renderer: incompatible with reproducible offline publication.
- Replace Mermaid entirely: loses unsupported diagram semantics and breaks existing documents.
- Reimplement every layout: discards the tested renderer and expands the maintenance scope.

## Consequences

- One authored source supports static reading and exploration. Interactive publication remains an explicit choice.
- Upstream runtime APIs and DOM structure are versioned integration dependencies. Updates require export, browser-isolation and visual regression tests.
- The package grows by the renderer subset; its inventory is included in SBOM assurance.
- Renderer execution is trusted build-time code with validated data, fixed paths, a minimal environment and execution limits. It is not an operating-system sandbox. Node filesystem permissions conflict with upstream ancestor-path inspection; this implementation does not claim confinement it cannot enforce.
- Native migration remains opt-in. External documentation targets must keep a readable representation or retain Mermaid.

## References

- [Issue #109](https://github.com/juangcarmona/arcshape/issues/109)
- [Reader runtime](../06-runtime-view/README.md)
- [Viewer isolation](../08-crosscutting-concepts/README.md)
- [Native adapter](../../../packages/cli/src/arc42-site/native-diagrams.mjs)
- [Pinned vendor inventory](../../../packages/cli/assets/archify/inventory.json)
