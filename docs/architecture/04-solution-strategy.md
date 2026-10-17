---
title: Solution strategy
arc42-section: "04"
description: Fundamental decisions and strategies that shape the architecture.
---

# 4. Solution strategy

## Technology decisions

ArcShape is distributed as an npm package and runs locally in the adopting repository. Its source documentation is Markdown. The `init` command uses native Node.js ESM without runtime dependencies; the site renderer uses pinned Markdown, Mermaid, and browser packages.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->

## Top-level decomposition

- `bin/arcshape.mjs` dispatches human-invoked CLI commands.
- `bin/init.mjs` creates the local arc42 workspace and protects existing content.
- `bin/agents/` detects providers locally and plans, confirms, and manages selected capability files using scoped hash manifests.
- `bin/session.mjs` inventories repository files in bounded rounds and persists source classifications, findings, leads, questions, and answers locally.
- `bin/validate.mjs` checks the README and twelve Markdown sections against the renderer's arc42 contract.
- `bin/validate.mjs --links` also checks repository-local Markdown and image targets and Markdown heading fragments.
- `bin/sync.mjs` routes documentation sync operations; `bin/confluence.mjs` updates one selected Confluence page, while `bin/confluence-pages.mjs` publishes an index and individual arc42 pages with local hash tracking and remote-change detection.
- `bin/site.mjs` invokes the static reader-site generator.
- `templates/architecture/` contains the Markdown scaffold shipped in the package.
- `capabilities/` contains provider-neutral skills, the provider discovery registry, and exact legacy hashes for migration.
- `docs/product/model/` records product intent; it is not generated from implementation.
- `openspec/` contains temporary delivery planning and validation integration.

## Quality realization

The CLI uses exclusive file creation and compares existing content before deciding whether a file is up to date or conflicts. AI reasoning is reserved for the separate assistant workflow layer; deterministic CLI commands own setup and bookkeeping.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
