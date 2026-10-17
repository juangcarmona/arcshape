---
title: Building block view
arc42-section: "05"
description: The static decomposition of the system into building blocks.
---

# 5. Building block view

## Level 1: system

ArcShape is currently one npm package with a command dispatcher, repository setup and evidence-session operations, a Markdown site renderer, packaged architecture templates, and Codex/Claude workflows. It has no server or database.

## Level 2: building blocks

| Building block         | Responsibility                                                                                                    | Evidence                                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLI entry point        | Parses commands and routes initialization, evidence sessions, validation, and site builds.                        | [`bin/arcshape.mjs`](../../bin/arcshape.mjs)                                                                                                         |
| Initialization module  | Resolves the target repository, installs architecture templates and assistant workflows, and reports conflicts.   | [`bin/init.mjs`](../../bin/init.mjs)                                                                                                                 |
| Session module         | Inventories language-neutral evidence tiers, tracks coverage and drift, and stores review records.                | [`bin/session.mjs`](../../bin/session.mjs)                                                                                                           |
| Validation module      | Checks the README and all twelve section files against the arc42 Markdown contract.                               | [`bin/validate.mjs`](../../bin/validate.mjs)                                                                                                         |
| Documentation sync     | Copies Markdown into Obsidian or publishes arc42 and selected Markdown pages to Confluence with change detection. | [`bin/sync.mjs`](../../bin/sync.mjs), [`bin/confluence.mjs`](../../bin/confluence.mjs), [`bin/confluence-pages.mjs`](../../bin/confluence-pages.mjs) |
| Architecture templates | Supplies the README and twelve arc42 Markdown sections.                                                           | [`templates/architecture/`](../../templates/architecture/)                                                                                           |
| Assistant workflows    | Guides reverse engineering, arc42 authoring, ADRs, and C4 diagram work for Codex and Claude.                      | [`templates/assistants/`](../../templates/assistants/)                                                                                               |
| Site renderer          | Validates Markdown metadata, sanitizes rendered HTML, and embeds Mermaid diagrams in one reader page.             | [`tools/arc42-site/`](../../tools/arc42-site/)                                                                                                       |
| Product model          | Owns user-facing product intent and constraints.                                                                  | [`docs/product/model/`](../product/model/)                                                                                                           |
| Delivery configuration | Defines CI and temporary OpenSpec change workflows.                                                               | [`.github/workflows/`](../../.github/workflows/) and [`openspec/`](../../openspec/)                                                                  |

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7dcae213a0ff556824ec2da92ee977447f007034d8f5b308ebcdd5851c9a5035" -->

## C4 container view

The CLI and assistant instructions are installed into the target repository alongside the canonical Markdown. Codex and Claude remain external assistant hosts; ArcShape does not host an AI runtime. The diagram shows the container boundaries and the maintainer's separate deterministic and AI-assisted interactions.

```mermaid
accTitle: ArcShape containers in a project repository
C4Container
    title ArcShape Container View
    Person(maintainer, "Repository maintainer", "Uses CLI and an assistant")
    System_Ext(assistant, "Codex / Claude", "Runs installed skills with repository context")
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
