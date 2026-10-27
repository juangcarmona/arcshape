<!-- pdac-scope: cited -->

# Interactive architecture diagrams

## Purpose

Let maintainers author one reviewable diagram source and publish readable static or interactive architecture views without losing existing Mermaid content.

## ADDED Requirements

### Requirement: Native source stays in canonical Markdown

The site builder SHALL accept typed JSON in `archify` fences, require a meaningful title and supported diagram family, and report invalid source with its document and diagram location. It SHALL NOT silently switch engines or modify authored files.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->

#### Scenario: Reject an invalid declared source

- **WHEN** a native fence contains malformed JSON, an unsupported family, missing title, invalid references or disallowed external resources
- **THEN** generation fails with an actionable diagnostic before publishing partial output

#### Scenario: Rebuild identical inputs

- **WHEN** the same documentation and source revision are built twice
- **THEN** the generated files are identical and authored sources are unchanged

### Requirement: Preserve mixed and self-contained output

Existing Mermaid fences and default single-file generation SHALL remain supported. Native diagrams SHALL have readable static representations in single-file output and when interactive scripting is unavailable.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->

#### Scenario: Build a mixed document

- **WHEN** a section contains native and Mermaid fences
- **THEN** both render, retain accessible names, and appear in document order

#### Scenario: Open a self-contained reader offline

- **WHEN** a reader opens the generated default HTML through a local file URL with networking disabled
- **THEN** both kinds of diagrams are visible without external runtime assets

### Requirement: Offer compact interactive publication

An explicit folder-publication option SHALL provide interactive diagrams at available content width with bounded responsive height, ordinary document scrolling, and one unobtrusive dedicated-page link without duplicate explanatory wrappers.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->
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

Diagram code SHALL NOT directly read or modify the parent document or its storage. Hostile source and forged integration messages SHALL NOT execute arbitrary script, escape output paths, trigger network requests or navigate the parent without reader action.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

#### Scenario: Reject hostile input and messages

- **WHEN** input attempts script injection, external assets, repository access or output traversal, or an unrelated window sends a viewer message
- **THEN** the unsafe input is rejected or inert and no unauthorized side effect occurs

#### Scenario: Test the embedding boundary

- **WHEN** script in an embedded diagram attempts parent-document or storage access
- **THEN** browser isolation denies it while supported selection and navigation still work

### Requirement: Publish without development-machine dependencies

The installed npm package SHALL contain the supported renderers, assets, authoring references and attribution. Folder output SHALL work under a root or subpath without a backend, CDN, ArcShape service or development checkout.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

#### Scenario: Generate from a clean packed installation

- **WHEN** the package is installed into an unrelated temporary repository
- **THEN** supported fixtures generate without the ArcShape source checkout or optional renderer downloads

### Requirement: Support readable native families

Native diagrams SHALL cover C4-style context, containers and components, sequence, and activity flows. Supported additional families and feature limitations SHALL be documented rather than inferred from Mermaid coverage.
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->

#### Scenario: Render the supported-family gallery

- **WHEN** the representative gallery is generated
- **THEN** architecture, sequence, workflow, lifecycle, dataflow, ERD, class, tree, timeline and waterfall examples render with readable labels and relationships

#### Scenario: Use keyboard and a narrow screen

- **WHEN** a reader operates a diagram by keyboard or at a 390px viewport
- **THEN** selection, zoom/reset and dedicated-page navigation remain reachable and the outer page does not overflow horizontally

### Requirement: Assist reviewable authoring and migration

Packaged skills SHALL select a supported representation from evidence, respect explicit engine choices, validate and inspect renders, and present source changes and visual evidence for maintainer review. Unsupported semantics SHALL remain Mermaid; migration SHALL require an explicit request.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:a1b8909b36e850b9ac1a2e5639f89749b039875f2fbe9c648167ed174edb8a89" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:2721d6d68d994addd06a0b270bef3fad3efc21639c97c63ba3c43005c788070e" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->

#### Scenario: Preserve existing external publication

- **WHEN** a proposed conversion cannot preserve a readable representation in the maintainer's configured external documentation targets
- **THEN** the original diagram remains unchanged and the limitation is reported before conversion
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->

#### Scenario: Update ArcShape without requesting migration

- **WHEN** the maintainer updates the package or skills
- **THEN** existing authored diagrams remain untouched
