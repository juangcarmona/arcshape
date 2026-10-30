---
title: Solution strategy
arc42-section: "04"
description: Fundamental decisions and strategies that shape the architecture.
---

# 4. Solution strategy

## Technology decisions

ArcShape is distributed as the `@arcshape/cli` npm workspace package and runs locally in the adopting repository. Canonical documentation lives in `docs/`; the repository root is a private npm workspace that owns development tooling. The CLI and architecture reader are implemented in `packages/cli/src/`, and distributable templates and capabilities are in `packages/cli/assets/`.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:c49ed716a9b078b766666bf79afa2e999a366a9444732c659691b34baba853e1" -->

## Top-level decomposition

- `packages/cli/src/bin/arcshape.mjs` dispatches human-invoked CLI commands.
- `packages/cli/src/bin/` contains CLI modules for setup, capability management, sessions, validation, and documentation sync.
- `packages/cli/src/arc42-site/` contains the architecture reader implementation.
- `packages/cli/assets/architecture/` contains the Markdown scaffold shipped in the package.
- `packages/cli/assets/capabilities/` contains provider-neutral skills, the provider discovery registry, and exact legacy hashes for migration.
- `src/public-site/` contains the ArcShape-owned static product site source and assets. Cloudflare Pages serves this surface independently of engineering-artifact publication.
- `src/engineering-portal/` contains the compact landing page published at the GitHub Pages root. The workflow generates the Product Snapshot and Architecture Snapshot from canonical Markdown into separate routes.
- `docs/product/model/` records product intent; it is not generated from implementation.
- `openspec/` contains temporary delivery planning and validation integration.

## Quality realization

The CLI uses exclusive file creation and compares existing content before deciding whether a file is up to date or conflicts. AI reasoning is reserved for the separate assistant workflow layer; deterministic CLI commands own setup and bookkeeping.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:fb9d6549efa4555755042489cd9eda2439cf6afad7d0171663ef2b9edeecd33d" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## Diagram source strategy

Native bundles are the default authored representation: canonical JSON with generated SVG and fenced Mermaid Markdown companions. Markdown displays the SVG; snapshots embed it and folder publication resolves the native viewer. Existing Mermaid sources retain bounded native enhancement and whole-diagram fallback. [ADR-0003](../09-architecture-decisions/ADR-0003-enhance-mermaid-with-native-diagrams.md) records the parser, layout and compatibility trade-offs.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:02d4c9bc5238c5d6bc5e162f0cda52dee6c00a5b0229f8b841f811a533b8f06c" -->
