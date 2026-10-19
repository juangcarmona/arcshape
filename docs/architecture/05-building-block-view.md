---
title: Building block view
arc42-section: "05"
description: The static decomposition of the system into building blocks.
---

# 5. Building block view

## Level 1: system

ArcShape is a private npm workspace with a distributable CLI package, separately packaged provider-neutral agent skills, provider adapters, repository setup and evidence-session operations, and a Markdown site renderer. The workspace root owns development dependencies and repository automation. ArcShape has no server or database.

## Level 2: building blocks

| Building block         | Responsibility                                                                                                       | Evidence                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLI entry point        | Parses commands and routes initialization, evidence sessions, validation, and site builds.                           | [`packages/cli/src/bin/arcshape.mjs`](../../packages/cli/src/bin/arcshape.mjs) |
| CLI modules            | Resolve the target repository and implement setup, capability management, sessions, validation, and documentation sync. | [`packages/cli/src/bin/`](../../packages/cli/src/bin/) |
| Architecture templates | Supplies the README and twelve arc42 Markdown sections.                                                              | [`packages/cli/assets/architecture/`](../../packages/cli/assets/architecture/) |
| Capability package     | Supplies four provider-neutral Agent Skills and the seven-provider path registry.                                    | [`packages/cli/assets/capabilities/`](../../packages/cli/assets/capabilities/) |
| Site renderer          | Validates Markdown metadata, sanitizes rendered HTML, and embeds Mermaid diagrams in one reader page.                | [`packages/cli/src/arc42-site/`](../../packages/cli/src/arc42-site/) |
| Product model          | Owns user-facing product intent and constraints.                                                                     | [`docs/product/model/`](../product/model/)                                                                                                           |
| Public product site    | ArcShape-owned static marketing content and assets; Cloudflare Pages is configured independently from portal publishing. | [`src/public-site/`](../../src/public-site/) and [deployment guide](../pages-deployment.md) |
| Engineering portal     | Links source-revision-stamped product and architecture projections.                                                   | [`src/engineering-portal/`](../../src/engineering-portal/) and [Pages workflow](../../.github/workflows/pages.yml) |
| Delivery configuration | Defines CI, single-writer Pages publication, and temporary OpenSpec change workflows.                                 | [`.github/workflows/`](../../.github/workflows/) and [`openspec/`](../../openspec/)                                                                  |

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
