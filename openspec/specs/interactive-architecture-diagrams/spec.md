<!-- pdac-scope: cited -->

# interactive-architecture-diagrams Specification

## Purpose

Let maintainers author one reviewable diagram source and publish readable static or interactive architecture views without losing existing Mermaid content.

## Requirements

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

### Requirement: Preserve mixed and self-contained output

Existing Mermaid fences and default single-file generation SHALL remain supported. Native diagrams SHALL have readable static representations in single-file output and when interactive scripting is unavailable.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

#### Scenario: Build a mixed document

- **WHEN** a section contains native and Mermaid fences
- **THEN** both render, retain accessible names, and appear in document order

#### Scenario: Open a self-contained reader offline

- **WHEN** a reader opens the generated default HTML through a local file URL with networking disabled
- **THEN** both kinds of diagrams are visible without external runtime assets

#### Scenario: Disable JavaScript or fail viewer startup

- **WHEN** JavaScript is disabled in either output mode, or a dedicated viewer fails to start
- **THEN** reachable static markup shows the diagram instead of depending on the reader's JavaScript router

### Requirement: Offer compact interactive publication

An explicit folder-publication option SHALL provide interactive diagrams at available content width with bounded responsive height, ordinary document scrolling, and one unobtrusive dedicated-page link without duplicate explanatory wrappers.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->

#### Scenario: Explore an embedded diagram

- **WHEN** the reader selects a supported node or relationship
- **THEN** the diagram highlights related content without leaving the section

#### Scenario: Navigate a large diagram

- **WHEN** the reader zooms or pans deliberately
- **THEN** the diagram viewport changes without adding a nested document scrollbar, and ordinary wheel scrolling continues to move the outer document

#### Scenario: Open the dedicated page

- **WHEN** the reader follows the link after selecting an element
- **THEN** a separate tab shows that diagram with its selection and theme preserved

### Requirement: Isolate interactive diagram execution

Diagram code SHALL be isolated from its parent, opener and shared storage in embedded and dedicated views. Unsafe input and forged messages SHALL have no unauthorized effects.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

#### Scenario: Reject hostile input and messages

- **WHEN** input attempts script injection, external assets, repository access or output traversal, or an unrelated window sends a viewer message
- **THEN** the unsafe input is rejected or inert and no unauthorized side effect occurs

#### Scenario: Test the embedding boundary

- **WHEN** script in an embedded diagram attempts parent-document or storage access
- **THEN** browser isolation denies it while supported selection and navigation still work

#### Scenario: Navigate directly to published artifacts

- **WHEN** any generated viewer page is opened directly, including through its dedicated link
- **THEN** its runtime still executes in an opaque-origin sandbox without shared-storage or opener access; no unsandboxed raw viewer artifact is published

### Requirement: Publish without development-machine dependencies

The installed npm package SHALL contain renderers, assets, authoring references and attribution for portable folder output.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
#### Scenario: Generate from a clean packed installation

- **WHEN** the package is installed into an unrelated temporary repository
- **THEN** supported fixtures generate without the ArcShape source checkout or optional renderer downloads, and output works at root or subpath without a backend, CDN or ArcShape service

### Requirement: Support readable native families

Native diagrams SHALL cover C4-style context, containers and components, sequence, and activity flows. Supported additional families and feature limitations SHALL be documented rather than inferred from Mermaid coverage.
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

#### Scenario: Render the supported-family gallery

- **WHEN** the representative gallery is generated
- **THEN** architecture, sequence, workflow, lifecycle, dataflow, ERD, class, tree, timeline and waterfall examples render with readable labels and relationships

#### Scenario: Use keyboard and a narrow screen

- **WHEN** a reader operates a diagram by keyboard or at a 390px viewport
- **THEN** selection, zoom/reset and dedicated-page navigation remain reachable and the outer page does not overflow horizontally

### Requirement: Assist reviewable authoring and migration

Skills SHALL author standard Mermaid by default and provide evidence-grounded, validated and visually inspected diagram proposals for human review. Native-only diagrams SHALL use local sidecars and generated SVG previews; legacy native fences remain supported.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:714e639903d0c64e71bc317548bd56659f880270c87302a3b7a8dba7f6ab8e56" -->

#### Scenario: Respect maintainer intent

- **WHEN** the assistant authors a diagram
- **THEN** it respects explicit engine choices and approved product intent, keeps unsupported semantics in Mermaid, and presents source changes and visual evidence for review

### Requirement: Preserve documentation during opt-in migration

Migration SHALL require an explicit request and preserve readable documentation and approved product intent.
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->

#### Scenario: Preserve existing external publication

- **WHEN** a proposed conversion cannot preserve a readable representation in the maintainer's configured external documentation targets
- **THEN** the original diagram remains unchanged and the limitation is reported before conversion

#### Scenario: Update ArcShape without requesting migration

- **WHEN** the maintainer updates the package or skills
- **THEN** existing authored diagrams remain untouched

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
