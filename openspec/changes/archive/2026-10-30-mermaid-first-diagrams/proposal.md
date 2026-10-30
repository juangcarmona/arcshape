<!-- pdac-scope: cited -->
# Proposal

## Why

Native fences display JSON in ordinary Markdown readers. Implement the human-approved and applied CHG-MERMAID-FIRST-DIAGRAMS and CHG-MERMAID-READER-DEEP-DIVES so Markdown remains useful without building the site.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

## What Changes

Default to standard Mermaid; render Mermaid in the main reader and generate separate Archify deep dives only for a documented, fully understood subset. Preserve unsupported syntax through strict Mermaid rendering and keep malformed input/renderer failures as errors. Add local native sidecars with SVG previews and explicit preview generation/freshness checks. Retain old native fences and the compact interactive widget.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `interactive-architecture-diagrams`: Mermaid-first authoring, separate compatible Archify deep dives, original source retention and native-only previews.

## Impact

Reader build, native adapter, CLI site commands, packaged authoring guidance, tests and architecture dogfooding. Promote existing installed Mermaid 12.2.0 and dagre-d3-es 7.0.14 to direct runtime dependencies. Do not modify the vendored renderer.

Product impact: FR-INTERACTIVE-DIAGRAMS, FR-CLI-COMMANDS, FR-ASSISTED-WORKFLOWS and UC-CREATE-ARCHITECTURE-DIAGRAMS changed through ProductShape. Inspect FR-C4-DIAGRAM-WORKFLOWS, FR-READER-VIEW, capability distribution, external connections, actors, terms and authority rule; their contracts stay unchanged. C4 abstraction and supported external documentation readability remain constraints. No remote image upload capability is added.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:714e639903d0c64e71bc317548bd56659f880270c87302a3b7a8dba7f6ab8e56" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## Product definition drift

Resolved through CHG-MERMAID-FIRST-DIAGRAMS and CHG-MERMAID-READER-DEEP-DIVES, approved in this conversation before ProductShape apply. Delivery and merge acceptance remain separate.
