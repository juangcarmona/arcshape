---
title: Building block view
arc42-section: "05"
description: The static decomposition of the system into building blocks.
---

# 5. Building block view

## Level 1: system

ArcShape is currently one npm package with a deterministic CLI, separately packaged provider-neutral agent skills, provider adapters, repository setup and evidence-session operations, and a Markdown site renderer. It has no server or database.

## Level 2: building blocks

| Building block         | Responsibility                                                                                                       | Evidence                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLI entry point        | Parses commands and routes initialization, evidence sessions, validation, and site builds.                           | [`bin/arcshape.mjs`](../../bin/arcshape.mjs)                                                                                                         |
| Initialization module  | Resolves the target repository, plans architecture scaffolding and optional capability setup, and reports conflicts. | [`bin/init.mjs`](../../bin/init.mjs)                                                                                                                 |
| Agent capability CLI   | Detects providers and manages selected skills through previewed, hash-tracked file operations.                       | [`bin/agents/`](../../bin/agents/)                                                                                                                   |
| Session module         | Inventories language-neutral evidence tiers, tracks coverage and drift, and stores review records.                   | [`bin/session.mjs`](../../bin/session.mjs)                                                                                                           |
| Validation module      | Checks the README and all twelve section files against the arc42 Markdown contract.                                  | [`bin/validate.mjs`](../../bin/validate.mjs)                                                                                                         |
| Documentation sync     | Copies Markdown into Obsidian or publishes arc42 and selected Markdown pages to Confluence with change detection.    | [`bin/sync.mjs`](../../bin/sync.mjs), [`bin/confluence.mjs`](../../bin/confluence.mjs), [`bin/confluence-pages.mjs`](../../bin/confluence-pages.mjs) |
| Architecture templates | Supplies the README and twelve arc42 Markdown sections.                                                              | [`templates/architecture/`](../../templates/architecture/)                                                                                           |
| Capability package     | Supplies four provider-neutral Agent Skills and the seven-provider path registry.                                    | [`capabilities/`](../../capabilities/)                                                                                                               |
| Site renderer          | Validates Markdown metadata, sanitizes rendered HTML, and embeds Mermaid diagrams in one reader page.                | [`tools/arc42-site/`](../../tools/arc42-site/)                                                                                                       |
| Product model          | Owns user-facing product intent and constraints.                                                                     | [`docs/product/model/`](../product/model/)                                                                                                           |
| Delivery configuration | Defines CI and temporary OpenSpec change workflows.                                                                  | [`.github/workflows/`](../../.github/workflows/) and [`openspec/`](../../openspec/)                                                                  |

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## C4 container view

The CLI installs canonical Markdown and optional agent skills into the selected repository. Agent providers remain external hosts; ArcShape does not host an AI runtime. The diagram shows the container boundaries and the maintainer's separate deterministic and AI-assisted interactions.

```mermaid
accTitle: ArcShape containers in a project repository
C4Container
    title ArcShape Container View
    Person(maintainer, "Repository maintainer", "Uses CLI and an assistant")
    System_Ext(assistant, "Agent provider", "Runs selected installed skills with repository context")
    System_Boundary(project, "Project repository") {
        Container(cli, "ArcShape CLI", "Node.js package", "Initializes, validates, and synchronizes Markdown docs")
        Container(skills, "ArcShape skills", "Markdown files", "Guide AI-assisted analysis and documentation")
        Container(docs, "Architecture documentation", "Markdown files", "Stores canonical arc42 docs and ADRs")
    }
    Rel(maintainer, cli, "Runs deterministic commands")
    Rel(maintainer, assistant, "Requests documentation work")
    Rel(assistant, skills, "Follows installed workflow")
    Rel(assistant, docs, "Proposes reviewed Markdown changes")
    Rel(cli, docs, "Reads and writes")
```
