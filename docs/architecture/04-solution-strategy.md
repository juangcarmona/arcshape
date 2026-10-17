---
title: Solution strategy
arc42-section: "04"
description: Fundamental decisions and strategies that shape the architecture.
---

# 4. Solution strategy

## Technology decisions

ArcShape is distributed as an npm package and runs locally in the adopting repository. Its source documentation is Markdown. The `init` command uses native Node.js ESM without runtime dependencies; the site renderer uses pinned Markdown, Mermaid, and browser packages.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:f4289478d4678ba40962a5599539b7db614bbaa9f68f2ece81d2d0a226a4f030" -->

## Top-level decomposition

- `bin/arcshape.mjs` dispatches human-invoked CLI commands.
- `bin/init.mjs` creates the local arc42 workspace and protects existing content.
- `bin/session.mjs` inventories repository files in bounded rounds and persists source classifications, findings, leads, questions, and answers locally.
- `bin/validate.mjs` checks the README and twelve Markdown sections against the renderer's arc42 contract.
- `bin/validate.mjs --links` also checks repository-local Markdown and image targets and Markdown heading fragments.
- `bin/sync.mjs` routes documentation sync operations; `bin/confluence.mjs` updates one selected Confluence page, while `bin/confluence-pages.mjs` publishes an index and individual arc42 pages with local hash tracking and remote-change detection.
- `bin/site.mjs` invokes the static reader-site generator.
- `templates/architecture/` contains the Markdown scaffold shipped in the package.
- `docs/product/model/` records product intent; it is not generated from implementation.
- `openspec/` contains temporary delivery planning and validation integration.

## Quality realization

The CLI uses exclusive file creation and compares existing content before deciding whether a file is up to date or conflicts. AI reasoning is reserved for the separate assistant workflow layer; deterministic CLI commands own setup and bookkeeping.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7dcae213a0ff556824ec2da92ee977447f007034d8f5b308ebcdd5851c9a5035" -->
