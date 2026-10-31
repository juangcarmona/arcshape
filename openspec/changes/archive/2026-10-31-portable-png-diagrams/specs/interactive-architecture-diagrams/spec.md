<!-- pdac-scope: cited -->

## MODIFIED Requirements

### Requirement: Native source stays in canonical Markdown

The site builder SHALL accept typed JSON in legacy `archify` fences and local native sidecars paired with Markdown PNG or SVG previews, require a meaningful title and supported diagram family, and report invalid source with its document and diagram location. It SHALL NOT silently switch engines or modify authored files.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->

#### Scenario: Reject an invalid declared source

- **WHEN** a native fence contains malformed JSON, an unsupported family, missing title, invalid references or disallowed external resources
- **THEN** generation fails with an actionable diagnostic before publishing partial output

#### Scenario: Rebuild identical inputs

- **WHEN** the same documentation and source revision are built twice
- **THEN** the generated files are identical and authored sources are unchanged


### Requirement: Assist reviewable authoring and migration

Skills SHALL author canonical native JSON with generated SVG, PNG and fenced Mermaid Markdown companions by default, and provide evidence-grounded, validated and visually inspected proposals for human review. Explicit Mermaid choices and legacy native/Mermaid documents SHALL remain supported.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:ac09dcb4dd5f8d437006a51f654c3f1b3d218dc223ca1ebb0a67311bdfe6b0ed" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:1ec5f68cf7a73bff2e6d29613b060430717f21a418e0abf353fc9ec349de4e02" -->

#### Scenario: Respect maintainer intent

- **WHEN** the assistant authors a diagram
- **THEN** it respects explicit engine choices and approved product intent, keeps unsupported semantics in Mermaid, and presents source changes and visual evidence for review


### Requirement: Keep native-only Markdown readable

Native-only diagrams SHALL support local JSON sidecars paired with PNG or legacy SVG previews in Markdown. Explicit tooling SHALL generate previews and check freshness. Builds SHALL verify previews without rewriting sources. References SHALL remain inside the documentation root and reuse native input validation.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->

#### Scenario: Read and publish a native-only diagram

- **WHEN** Markdown contains a paired PNG or SVG and native sidecar
- **THEN** Markdown readers display the selected image and the generated site displays one native diagram in the same position

#### Scenario: Detect stale previews

- **WHEN** a sidecar changes without regenerating its preview
- **THEN** the check and build fail with an actionable regenerate instruction

#### Scenario: Reject unsafe references

- **WHEN** a reference is remote, traverses outside docs, escapes through symlinks or ambiguously associates sources
- **THEN** processing fails before reading outside docs or overwriting authored files


### Requirement: Maintain native diagram bundles

Native authoring SHALL use one canonical JSON source with generated SVG, PNG and a supported Mermaid companion in standard fenced Markdown. New Markdown SHALL show the PNG; folder publication SHALL resolve the native widget. Unsupported exports SHALL be reported, not fabricated.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:ac09dcb4dd5f8d437006a51f654c3f1b3d218dc223ca1ebb0a67311bdfe6b0ed" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ff3d03ebe93668cb0392a672fe63b9925404fab9dc2fb7891931f1f5d2ea799d" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:1ec5f68cf7a73bff2e6d29613b060430717f21a418e0abf353fc9ec349de4e02" -->

#### Scenario: Generate and publish a bundle

- **WHEN** a maintainer explicitly generates a supported native bundle
- **THEN** JSON, SVG, PNG and fenced Mermaid Markdown coexist in the owning diagrams directory, the document displays PNG, and interactive publication displays one native viewer

#### Scenario: Detect stale or edited assets

- **WHEN** source or companion content changes independently
- **THEN** checks fail with actionable diagnostics and generation refuses to silently overwrite authored or modified output

#### Scenario: Preserve navigation and compatibility

- **WHEN** generated companion-only Markdown appears beside the diagram assets
- **THEN** it does not create a duplicate reader page, ordinary supporting Markdown remains visible, and existing Mermaid/native documents remain supported

#### Scenario: Migrate the architecture documentation

- **WHEN** the approved explicit migration is applied to ArcShape architecture
- **THEN** every existing architecture figure has a local diagrams bundle, including deployment and initialization, without losing actors, boundaries, ordering or branch conditions

## ADDED Requirements

### Requirement: Generate portable bounded PNG previews

Explicit generation SHALL create bounded, lossless light-background PNG previews with integrity checks. Existing SVG-only bundles SHALL remain usable.

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->

#### Scenario: Read Markdown without SVG support

- **WHEN** a new native bundle is generated and referenced by Markdown
- **THEN** the PNG is readable independently of SVG support and HTML publication still uses the native source

#### Scenario: Check PNG on another operating system

- **WHEN** an intact PNG has provenance matching its source and vector companion
- **THEN** it passes freshness checking without requiring byte-identical rasterization on that host

#### Scenario: Preserve authored and legacy output

- **WHEN** the selected PNG is missing, modified, stale or unsafe, or an existing SVG-only bundle is built
- **THEN** invalid PNG input fails without overwriting assets and the intact legacy bundle remains usable

