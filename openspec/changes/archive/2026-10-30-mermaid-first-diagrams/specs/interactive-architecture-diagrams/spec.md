<!-- pdac-scope: cited -->
# interactive-architecture-diagrams Delta

## MODIFIED Requirements

### Requirement: Native source stays in canonical Markdown

The site builder SHALL accept typed JSON in legacy `archify` fences and local native sidecars paired with Markdown SVG previews, require a meaningful title and supported diagram family, and report invalid source with its document and diagram location. It SHALL NOT silently switch engines or modify authored files.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

#### Scenario: Reject an invalid declared source

- **WHEN** a native fence contains malformed JSON, an unsupported family, missing title, invalid references or disallowed external resources
- **THEN** generation fails with an actionable diagnostic before publishing partial output

#### Scenario: Rebuild identical inputs

- **WHEN** the same documentation and source revision are built twice
- **THEN** the generated files are identical and authored sources are unchanged

### Requirement: Assist reviewable authoring and migration

Skills SHALL author standard Mermaid by default and provide evidence-grounded, validated and visually inspected diagram proposals for human review. Native-only diagrams SHALL use local sidecars and generated SVG previews; legacy native fences remain supported.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:714e639903d0c64e71bc317548bd56659f880270c87302a3b7a8dba7f6ab8e56" -->

#### Scenario: Respect maintainer intent

- **WHEN** the assistant authors a diagram
- **THEN** it respects explicit engine choices and approved product intent, keeps unsupported semantics in Mermaid, and presents source changes and visual evidence for review

## ADDED Requirements

### Requirement: Keep Mermaid primary and link compatible Archify deep dives

The main reader SHALL render Mermaid. Folder builds SHALL link separate Archify pages for compatible diagrams without replacing or duplicating the main figure. Unsupported diagrams SHALL have no unavailable link. Deep dives can be disabled. Invalid input and renderer failures SHALL fail with location.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

#### Scenario: Link a supported flow

- **WHEN** a diagram uses supported labeled nodes, directed relationships, directions and boundaries
- **THEN** the primary figure remains Mermaid and one new-tab link opens a faithful interactive Archify page

#### Scenario: Retain unsupported constructs

- **WHEN** valid Mermaid includes unsupported syntax such as sequence fragments or styling
- **THEN** the diagram renders through Mermaid without an Archify link and a located diagnostic explains the unsupported feature

#### Scenario: Reject invalid sources and renderer failures

- **WHEN** input is malformed or conversion/rendering fails
- **THEN** the build fails with source location rather than silently substituting another renderer

#### Scenario: Disable deep dives and retain source

- **WHEN** a maintainer disables deep dives or a reader retrieves a generated deep dive's original source
- **THEN** the main rendering remains Mermaid, optional pages are omitted when disabled, and original Mermaid sources remain unchanged

### Requirement: Keep native-only Markdown readable

Native-only diagrams SHALL support local JSON sidecars paired with SVG previews in Markdown. Explicit tooling SHALL generate previews and check freshness. Builds SHALL verify previews without rewriting sources. References SHALL remain inside the documentation root and reuse native input validation.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

#### Scenario: Read and publish a native-only diagram

- **WHEN** Markdown contains a paired SVG and native sidecar
- **THEN** Markdown readers display the SVG and the generated site displays one native diagram in the same position

#### Scenario: Detect stale previews

- **WHEN** a sidecar changes without regenerating its preview
- **THEN** the check and build fail with an actionable regenerate instruction

#### Scenario: Reject unsafe references

- **WHEN** a reference is remote, traverses outside docs, escapes through symlinks or ambiguously associates sources
- **THEN** processing fails before reading outside docs or overwriting authored files
