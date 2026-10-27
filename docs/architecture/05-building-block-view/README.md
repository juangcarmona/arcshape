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

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:a1b8909b36e850b9ac1a2e5639f89749b039875f2fbe9c648167ed174edb8a89" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->

## C4 container view

The CLI installs canonical Markdown and optional agent skills into the selected repository. Agent providers remain external hosts; ArcShape does not host an AI runtime. Local state records evidence sessions, sync baselines, and capability ownership. The diagram separates those responsibilities so the write paths are visible without implying that an agent provider calls an ArcShape server.

```archify
{
  "schema_version": 1,
  "diagram_type": "architecture",
  "meta": { "title": "ArcShape containers in a project repository", "visual_preset": "blueprint" },
  "components": [
    { "id": "maintainer", "type": "external", "icon": "person", "label": "Maintainer", "pos": [40, 60], "size": [210, 80] },
    { "id": "provider", "type": "external", "label": "Agent provider", "sublabel": "External host", "pos": [40, 400], "size": [210, 80] },
    { "id": "cli", "type": "backend", "label": "ArcShape CLI", "sublabel": "Node.js package", "pos": [480, 60], "size": [210, 80] },
    { "id": "docs", "type": "database", "label": "Architecture Markdown", "sublabel": "Canonical arc42 and ADRs", "pos": [480, 230], "size": [270, 80] },
    { "id": "skills", "type": "database", "label": "Installed skills", "sublabel": "Evidence and authoring", "pos": [480, 400], "size": [240, 80] },
    { "id": "state", "type": "database", "label": "Local ArcShape state", "sublabel": "Session and sync baselines", "pos": [960, 60], "size": [280, 80] }
  ],
  "connections": [
    { "id": "run", "from": "maintainer", "to": "cli", "label": "Runs commands", "variant": "emphasis" },
    { "id": "review", "from": "maintainer", "to": "docs", "fromSide": "right", "toSide": "left", "via": [[340,100],[340,270]], "label": "Reviews and edits", "labelAt": [340, 205] },
    { "id": "discover", "from": "provider", "to": "skills", "label": "Discovers and follows" },
    { "id": "propose", "from": "provider", "to": "docs", "fromSide": "right", "toSide": "left", "via": [[380,440],[380,270]], "label": "Proposes changes", "labelAt": [340, 350], "variant": "dashed" },
    { "id": "documents", "from": "cli", "to": "docs", "fromSide": "bottom", "toSide": "top", "label": "Reads and writes", "labelAt": [690, 190] },
    { "id": "baselines", "from": "cli", "to": "state", "label": "Records baselines" }
  ],
  "boundaries": [{ "kind": "region", "label": "Adopter repository", "wraps": ["cli", "docs", "skills", "state"], "pad": 30 }]
}
```
