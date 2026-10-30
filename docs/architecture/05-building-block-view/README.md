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
| Site renderer | Validates Markdown, renders Mermaid and native sources, and publishes either a single-file snapshot or an interactive directory. | [`packages/cli/src/arc42-site/`](../../../packages/cli/src/arc42-site/) |
| Native diagram adapter | Validates bounded JSON, invokes the pinned renderer, exports static SVG and isolates the browser viewer. | [`native-diagrams.mjs`](../../../packages/cli/src/arc42-site/native-diagrams.mjs), [`native-viewer.mjs`](../../../packages/cli/src/arc42-site/native-viewer.mjs) |
| Product and publication surfaces | Remain adjacent repository artifacts: product intent, public site, engineering portal, and delivery workflows. | [`docs/product/model/`](../../product/model/), [`src/`](../../../src/), [`.github/workflows/`](../../../.github/workflows/) |

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

## C4 container view

The CLI installs canonical Markdown and optional agent skills into the selected repository. Agent providers remain external hosts; ArcShape does not host an AI runtime. Local state records evidence sessions, sync baselines, and capability ownership. The diagram separates those responsibilities so the write paths are visible without implying that an agent provider calls an ArcShape server.

```mermaid
flowchart LR
  accTitle: ArcShape containers in a project repository
  maintainer["Maintainer
External"]
  provider["Agent provider
External host · External"]
  subgraph boundary0["Adopter repository"]
    cli["ArcShape CLI
Node.js package"]
    docs["Architecture Markdown
Canonical arc42 and ADRs"]
    skills["Installed skills
Evidence and authoring"]
    state["Local ArcShape state
Session and sync baselines"]
  end
  maintainer ==>|"Runs commands"| cli
  maintainer -->|"Reviews and edits"| docs
  provider -->|"Discovers and follows"| skills
  provider -.->|"Proposes changes"| docs
  cli -->|"Reads and writes"| docs
  cli -->|"Records baselines"| state
```

The reader build owns Archify deep-dive eligibility and native preview resolution. Its parser worker isolates Mermaid's DOM setup from the reader's sanitizer; the deterministic layout adapter passes validated data into the existing native renderer. These build-time modules do not add a runtime service.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->
