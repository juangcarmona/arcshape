<!-- pdac-scope: cited -->

# Spec Delta

## Purpose

Provides a stable GitHub Pages entry point for generated ArcShape engineering artifacts while keeping each canonical source in its owning Markdown model or documentation.

Requirements preserve source authority and the reader's architecture-view semantics.

<!-- pdac:cite id="FR-PRODUCT-DEFINITION-LINKS" digest="sha256:d653de7a070313b78fa267d4419b7f31544e393c3c1ac2721ac0dbc231d92a26" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ff3d03ebe93668cb0392a672fe63b9925404fab9dc2fb7891931f1f5d2ea799d" -->
<!-- pdac:cite id="TERM-ARCHITECTURE-VIEW" digest="sha256:3e258fedf716972d2e2905974920be0bd4e9e44fb5f074b6fb5fc00925f36b45" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## ADDED Requirements

### Requirement: Engineering portal links to generated model and architecture views

The GitHub Pages root MUST link to the generated Product Snapshot, Architecture Snapshot, and public product site.

#### Scenario: All available engineering views are reachable
- **WHEN** a reader opens the engineering portal
- **THEN** the landing page links to the model snapshot, architecture snapshot, and `https://arcshape.dev`

#### Scenario: Each snapshot identifies its source revision
- **WHEN** a reader opens either generated snapshot
- **THEN** its source revision is visible or resolvable from the page

### Requirement: Generated views preserve canonical-source authority

The portal MUST generate the Product Snapshot from `docs/product/model` and the Architecture Snapshot from `docs/architecture`. Both MUST remain read-only projections and MUST NOT replace or modify their canonical sources.

#### Scenario: Product Snapshot reflects the active model
- **WHEN** GitHub Pages is built from a repository revision
- **THEN** the Product Snapshot is generated from that revision's canonical ArcShape product model and reports that source revision

#### Scenario: Architecture Snapshot reflects the active documentation
- **WHEN** GitHub Pages is built from a repository revision
- **THEN** the Architecture Snapshot is generated from that revision's canonical arc42 Markdown and links to the matching source revision

### Requirement: Engineering publication is complete and serialized

One GitHub Pages publisher MUST assemble the landing page and all available generated views into a complete site artifact. A successful publication MUST include all available views, and concurrent production runs MUST NOT deploy partial or competing site contents.

#### Scenario: Architecture-only publication remains complete
- **WHEN** a site build has no suitable public E2E report
- **THEN** the landing page and both snapshots are still published and the E2E destination is not shown as available

#### Scenario: Failed build preserves the last published site
- **WHEN** generation or validation of any required site output fails
- **THEN** the workflow fails without replacing the last successful GitHub Pages publication

### Requirement: Existing architecture reader links continue to resolve

The engineering portal MUST preserve legacy root URLs that use the architecture reader's section hash route by redirecting them to the matching section under the architecture route.

#### Scenario: Legacy section bookmark
- **WHEN** a reader opens a previous root URL such as `/#/section/01`
- **THEN** the browser opens the corresponding section under the architecture snapshot route

### Requirement: Public E2E summary is conditional and provenance-bearing

The portal MUST show an E2E destination only when a completed `main` run produces a summary that passes the fixed public-summary schema and run-identity checks. The schema and publisher workflow are approved for public use through review of this change; individual runs do not require maintainer approval. Any published summary MUST identify its source commit, run, completion time, and result, and MUST omit credentials, private data, raw traces, and test-result files.

#### Scenario: No suitable E2E report exists
- **WHEN** no completed `main` run has a valid summary that passes the approved public schema and run-identity checks
- **THEN** the portal does not show an E2E report as available and other site content remains publishable

#### Scenario: Validated E2E summary is published
- **WHEN** a completed `main` run has a summary that passes the approved public schema and run-identity checks
- **THEN** the portal shows its run, source commit, completion time, and result without publishing raw traces or test-result files

### Requirement: Engineering portal remains understandable and accessible

The portal and its generated architecture view MUST provide accessible navigation and remain usable at desktop and mobile viewport sizes for technical and non-technical readers.

#### Scenario: Reader navigates with a keyboard
- **WHEN** a reader uses keyboard navigation on the portal or architecture view
- **THEN** all links and controls are reachable and have a visible focus state

#### Scenario: Reader uses a mobile viewport
- **WHEN** a reader opens the portal or architecture view at a narrow viewport
- **THEN** content and navigation remain available without horizontal overflow
