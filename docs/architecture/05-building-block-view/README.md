---
title: Building block view
arc42-section: "05"
description: The static decomposition of the system into building blocks.
---

# 5. Building block view

## Level 1: system

ArcShape is a private npm workspace whose distributable CLI runs inside an adopter's repository. It combines deterministic repository operations with an optional package of provider-neutral skills and a Markdown reader. The workspace root owns development dependencies and repository automation. ArcShape has no server or database.

## Level 2: building blocks

| Building block | Responsibility | Evidence |
| --- | --- | --- |
| CLI entry point | Parses commands and routes setup, evidence sessions, validation, sync, and site builds. | [`packages/cli/src/bin/arcshape.mjs`](../../../packages/cli/src/bin/arcshape.mjs) |
| CLI modules | Implement repository setup, capability management, sessions, validation, and documentation sync. | [`packages/cli/src/bin/`](../../../packages/cli/src/bin/) |
| Architecture templates | Supplies the README and twelve arc42 Markdown sections. | [`packages/cli/assets/architecture/`](../../../packages/cli/assets/architecture/) |
| Capability package | Supplies provider-neutral skills, provider discovery metadata, and managed-file hashes. | [`packages/cli/assets/capabilities/`](../../../packages/cli/assets/capabilities/) |
| Site renderer | Validates Markdown metadata, sanitizes HTML, and embeds accessible Mermaid diagrams in one reader page. | [`packages/cli/src/arc42-site/`](../../../packages/cli/src/arc42-site/) |
| Product and publication surfaces | Remain adjacent repository artifacts: product intent, public site, engineering portal, and delivery workflows. | [`docs/product/model/`](../../product/model/), [`src/`](../../../src/), [`.github/workflows/`](../../../.github/workflows/) |

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## C4 container view

The CLI installs canonical Markdown and optional agent skills into the selected repository. Agent providers remain external hosts; ArcShape does not host an AI runtime. Local state records evidence sessions, sync baselines, and capability ownership. The diagram separates those responsibilities so the write paths are visible without implying that an agent provider calls an ArcShape server.

```mermaid
accTitle: ArcShape containers in a project repository
C4Container
    title ArcShape inside an adopter repository
    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
    Person(maintainer, "Repository maintainer", "Runs the CLI and reviews changes")
    System_Ext(provider, "Selected agent provider", "Runs installed skills with repository context")
    System_Boundary(project, "Adopter repository") {
        Container(cli, "ArcShape CLI", "Node.js package", "Plans and performs deterministic repository operations")
        Container(docs, "Architecture Markdown", "Markdown files", "Canonical arc42 sections and ADRs")
        Container(skills, "Installed skills", "Markdown files", "Guide evidence review and documentation authoring")
        Container(state, "Local ArcShape state", "JSON files", "Session, sync, and capability baselines")
    }
    Rel(maintainer, cli, "Runs commands")
    Rel(maintainer, docs, "Reviews and edits")
    Rel(provider, skills, "Discovers and follows")
    Rel(provider, docs, "Proposes changes")
    Rel(cli, docs, "Reads and writes")
    Rel(cli, state, "Records baselines")
```
