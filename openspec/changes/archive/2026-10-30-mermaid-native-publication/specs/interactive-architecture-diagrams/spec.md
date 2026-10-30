<!-- pdac-scope: cited -->
# Spec Delta

## REMOVED Requirements

### Requirement: Keep Mermaid primary and link compatible Archify deep dives

**Reason**: Superseded by explicitly approved native publication from canonical Mermaid.
**Migration**: Keep authored Mermaid unchanged; use automatic native publication or select Mermaid-only output.

## ADDED Requirements

### Requirement: Publish native diagrams from canonical Mermaid

ArcShape SHALL publish a native representation for faithfully supported Mermaid sources without changing authored Markdown. Unsupported diagrams SHALL remain complete Mermaid. Explicit Mermaid-only output SHALL remain available; invalid sources and renderer failures SHALL fail with location.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:89a85bdce2b2abebe4b214d005673812cbfe6951fbedce009c8b7e7ee5815ce8" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:69b3896c64d3974d75ede346a61c67b9527c2b205b5d14c81921a1e7db40ff4b" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:03f8db70084a9f2ece5ae7ac432334aa62a0a23d6145c711d184683e2d744f3a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:73f884ab8bce44e3950b5c42b17912546f69e2f2045f3df2106b0ce59d99cfee" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:67954319dd8f19a50a9a15b09e024c343bae2d018e37dade767957254c6d689b" -->

#### Scenario: Generate an interactive document

- **WHEN** Mermaid uses supported flowchart nodes, relationships, directions and boundaries or a supported simple sequence
- **THEN** the main figure is a compact native widget with a dedicated-page link, no duplicate Mermaid figure, and original source available

#### Scenario: Generate a self-contained snapshot

- **WHEN** supported Mermaid is published as single-file HTML
- **THEN** a readable native SVG is embedded and works through a local file URL without external runtime resources

#### Scenario: Preserve unsupported semantics

- **WHEN** a diagram contains unsupported constructs such as sequence fragments, activations, notes or styling
- **THEN** the entire original diagram is rendered with Mermaid and a located diagnostic explains the unsupported feature

#### Scenario: Preserve sequence semantics

- **WHEN** supported plain participants and ordered messages are converted
- **THEN** participant identities, aliases, message labels, order and supported solid/dashed arrow kinds remain represented

#### Scenario: Select Mermaid-only publication

- **WHEN** the maintainer selects Mermaid-only output
- **THEN** Mermaid fences remain rendered by Mermaid without optional native artifacts and sources stay unchanged

#### Scenario: Reject invalid sources and renderer failures

- **WHEN** input is malformed or conversion/rendering fails
- **THEN** generation fails with source location rather than silently switching engines
