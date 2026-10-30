<!-- pdac-scope: cited -->
# Spec Delta

## ADDED Requirements

### Requirement: Maintain native diagram bundles

Native authoring SHALL use one canonical JSON source with generated SVG and a supported Mermaid companion in standard fenced Markdown. Markdown SHALL show the SVG; folder publication SHALL resolve the native widget. Unsupported exports SHALL be reported, not fabricated.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:02d4c9bc5238c5d6bc5e162f0cda52dee6c00a5b0229f8b841f811a533b8f06c" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:c49ed716a9b078b766666bf79afa2e999a366a9444732c659691b34baba853e1" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:fb9d6549efa4555755042489cd9eda2439cf6afad7d0171663ef2b9edeecd33d" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:8372d5e6f9b51e0e9d468289d65d352a7c930089dea72897a9bffe56f894e053" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:e1297804e0fc64a188b066d06c7c6acddb0c897f7554f99f0454898c4f545c4e" -->

#### Scenario: Generate and publish a bundle

- **WHEN** a maintainer explicitly generates a supported native bundle
- **THEN** JSON, SVG and fenced Mermaid Markdown coexist in the owning diagrams directory, the document displays SVG, and interactive publication displays one native viewer

#### Scenario: Detect stale or edited assets

- **WHEN** source or companion content changes independently
- **THEN** checks fail with actionable diagnostics and generation refuses to silently overwrite authored or modified output

#### Scenario: Preserve navigation and compatibility

- **WHEN** generated companion-only Markdown appears beside the diagram assets
- **THEN** it does not create a duplicate reader page, ordinary supporting Markdown remains visible, and existing Mermaid/native documents remain supported

#### Scenario: Migrate the architecture documentation

- **WHEN** the approved explicit migration is applied to ArcShape architecture
- **THEN** every existing architecture figure has a local diagrams bundle, including deployment and initialization, without losing actors, boundaries, ordering or branch conditions

## MODIFIED Requirements

### Requirement: Assist reviewable authoring and migration

Skills SHALL author canonical native JSON with generated SVG and fenced Mermaid Markdown companions by default, and provide evidence-grounded, validated and visually inspected proposals for human review. Explicit Mermaid choices and legacy native/Mermaid documents SHALL remain supported.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:fb9d6549efa4555755042489cd9eda2439cf6afad7d0171663ef2b9edeecd33d" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:e1297804e0fc64a188b066d06c7c6acddb0c897f7554f99f0454898c4f545c4e" -->

#### Scenario: Respect maintainer intent

- **WHEN** the assistant authors a diagram
- **THEN** it respects explicit engine choices and approved product intent, keeps unsupported semantics in Mermaid, and presents source changes and visual evidence for review
