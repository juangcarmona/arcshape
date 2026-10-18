---
title: Solution strategy
arc42-section: "04"
description: Fundamental decisions and strategies that shape the architecture.
---

# 4. Solution strategy

## Technology decisions

ArcShape is distributed as the `@arcshape/cli` npm workspace package and runs locally in the adopting repository. Canonical documentation lives in `docs/`; the repository root is a private npm workspace that owns development tooling. The CLI and architecture reader are implemented in `packages/cli/src/`, and distributable templates and capabilities are in `packages/cli/assets/`.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->

## Top-level decomposition

- `packages/cli/src/bin/arcshape.mjs` dispatches human-invoked CLI commands.
- `packages/cli/src/bin/` contains CLI modules for setup, capability management, sessions, validation, and documentation sync.
- `packages/cli/src/arc42-site/` contains the architecture reader implementation.
- `packages/cli/assets/architecture/` contains the Markdown scaffold shipped in the package.
- `packages/cli/assets/capabilities/` contains provider-neutral skills, the provider discovery registry, and exact legacy hashes for migration.
- `src/public-site/` is reserved for future ArcShape-owned static site source; it contains no implementation or deployment in this change.
- `docs/product/model/` records product intent; it is not generated from implementation.
- `openspec/` contains temporary delivery planning and validation integration.

## Quality realization

The CLI uses exclusive file creation and compares existing content before deciding whether a file is up to date or conflicts. AI reasoning is reserved for the separate assistant workflow layer; deterministic CLI commands own setup and bookkeeping.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
