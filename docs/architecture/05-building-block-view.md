---
title: Building block view
arc42-section: "05"
description: The static decomposition of the system into building blocks.
---

# 5. Building block view

## Level 1: system

ArcShape is currently one npm package with a command dispatcher, repository setup and evidence-session operations, a Markdown site renderer, packaged architecture templates, and Codex/Claude workflows. It has no server or database.

## Level 2: building blocks

| Building block         | Responsibility                                                                                        | Evidence                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| CLI entry point        | Parses commands and routes initialization, evidence sessions, validation, and site builds.            | [`bin/arcshape.mjs`](../../bin/arcshape.mjs)                                        |
| Initialization module  | Resolves the target repository, installs architecture templates and assistant workflows, and reports conflicts. | [`bin/init.mjs`](../../bin/init.mjs)                                                |
| Session module         | Inventories language-neutral evidence tiers, tracks coverage and drift, and stores review records.     | [`bin/session.mjs`](../../bin/session.mjs)                                          |
| Validation module      | Checks the README and all twelve section files against the arc42 Markdown contract.                   | [`bin/validate.mjs`](../../bin/validate.mjs)                                        |
| Documentation sync    | Copies Markdown into Obsidian or updates a selected Confluence page with change detection.              | [`bin/sync.mjs`](../../bin/sync.mjs), [`bin/confluence.mjs`](../../bin/confluence.mjs) |
| Architecture templates | Supplies the README and twelve arc42 Markdown sections.                                               | [`templates/architecture/`](../../templates/architecture/)                          |
| Assistant workflows   | Guides reverse engineering, arc42 authoring, ADRs, and C4 diagram work for Codex and Claude.           | [`templates/assistants/`](../../templates/assistants/)                              |
| Site renderer          | Validates Markdown metadata, sanitizes rendered HTML, and embeds Mermaid diagrams in one reader page. | [`tools/arc42-site/`](../../tools/arc42-site/)                                      |
| Product model          | Owns user-facing product intent and constraints.                                                      | [`docs/product/model/`](../product/model/)                                          |
| Delivery configuration | Defines CI and temporary OpenSpec change workflows.                                                   | [`.github/workflows/`](../../.github/workflows/) and [`openspec/`](../../openspec/) |

Cross-document link validation remains planned.
