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

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:fb9d6549efa4555755042489cd9eda2439cf6afad7d0171663ef2b9edeecd33d" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:02d4c9bc5238c5d6bc5e162f0cda52dee6c00a5b0229f8b841f811a533b8f06c" -->

## C4 container view

The CLI installs canonical Markdown and optional agent skills into the selected repository. Agent providers remain external hosts; ArcShape does not host an AI runtime. Local state records evidence sessions, sync baselines, and capability ownership. The diagram separates those responsibilities so the write paths are visible without implying that an agent provider calls an ArcShape server.

![ArcShape containers in a project repository](./diagrams/containers.svg)
<!-- arcshape-diagram-source: ./diagrams/containers.archify.json -->

The reader build owns native-bundle resolution and the compatibility path for existing Mermaid sources. Its parser worker isolates Mermaid's DOM setup from the reader's sanitizer; the deterministic layout adapter passes validated data into the existing native renderer. These build-time modules do not add a runtime service.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:c49ed716a9b078b766666bf79afa2e999a366a9444732c659691b34baba853e1" -->
