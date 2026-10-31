<!-- pdac-scope: cited -->

# Proposal

## Why

SVG-backed Markdown is unreadable in the adopter's Azure Repos surface. PNG provides a portable preview without replacing vector or native output.

## What Changes

- Add PNG companions and make PNG the new Markdown authoring default.
- Keep 0.3.0 JSON/SVG/Mermaid bundles valid; explicitly migrate only ArcShape's own canonical figures.
- Preserve native interactive and self-contained HTML publication from PNG image/source pairs.
- Add bounded lossless raster generation, integrity checking, packed/browser coverage and adopter migration notes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `interactive-architecture-diagrams`: PNG previews and four-file bundle compatibility.

## Impact

Implements applied CHG-PORTABLE-PNG-DIAGRAMS. Impacts FR-INTERACTIVE-DIAGRAMS, FR-CLI-COMMANDS, FR-ASSISTED-WORKFLOWS, FR-READER-VIEW and UC-CREATE-ARCHITECTURE-DIAGRAMS.

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:ac09dcb4dd5f8d437006a51f654c3f1b3d218dc223ca1ebb0a67311bdfe6b0ed" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ff3d03ebe93668cb0392a672fe63b9925404fab9dc2fb7891931f1f5d2ea799d" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:1ec5f68cf7a73bff2e6d29613b060430717f21a418e0abf353fc9ec349de4e02" -->

Impact analysis checked C4, publication/read use cases, actors, terms and authority rules. They remain unchanged: no diagram semantics, source authority, connectors, hosting or actor responsibilities change. The product change resolves the prior SVG-default conflict; there is no remaining product-definition drift. No dependency addition, Azure connector or external account operation is proposed.
