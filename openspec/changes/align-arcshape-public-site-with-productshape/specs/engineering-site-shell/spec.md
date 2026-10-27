<!-- pdac-scope: cited -->

# Spec Delta

## Purpose

Defines the Astro static shell and diagram rendering contract for ArcShape's independently published engineering portal.

## ADDED Requirements

<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

### Requirement: Astro migration preserves the established engineering portal
Astro MUST statically render the engineering portal shell while preserving its established appearance, route URLs, themes, responsive behavior, typography, spacing, and navigation. Generated Product and Architecture snapshots MUST retain their source-revision provenance, and the portal MUST support its GitHub Pages `/arcshape/` base path.

#### Scenario: Reader opens an engineering route after migration
- **WHEN** a reader opens an existing engineering-portal route after the Astro migration
- **THEN** the route preserves its URL and established presentation, and generated content identifies its source revision

#### Scenario: Reader visits the GitHub Pages subpath
- **WHEN** a reader opens the engineering portal at `/arcshape/`
- **THEN** navigation, assets, snapshots, and internal links resolve under that base path

#### Scenario: Engineering artifact follows the prior route
- **WHEN** a reader opens an existing architecture bookmark or engineering-artifact link
- **THEN** the established route compatibility behavior remains available

### Requirement: Markdown diagrams retain renderer identity and provenance
The engineering publication MUST continue to render Mermaid fences from canonical Markdown and MUST support Archify as an enhanced static HTML diagram renderer. Every rendered diagram MUST expose its renderer identity, a link to its Markdown or diagram source, source-revision provenance, accessible labels, and non-colour cues. Diagram and source links MUST resolve at both the site root and `/arcshape/` base.

#### Scenario: Reader opens a Mermaid diagram
- **WHEN** a reader views architecture Markdown containing a Mermaid diagram
- **THEN** the diagram renders accessibly and exposes Mermaid renderer identity, source link, and the published source revision

#### Scenario: Reader opens an Archify diagram
- **WHEN** a reader follows a Markdown reference to a published Archify diagram
- **THEN** a standalone static HTML diagram opens with Archify identity, source and revision links, and accessible keyboard navigation

#### Scenario: Site uses a root or subpath base
- **WHEN** the engineering output is built for `/` or `/arcshape/`
- **THEN** its navigation, assets, diagram routes, and source links resolve from the configured base

### Requirement: Engineering publication remains isolated
The engineering portal MUST produce a static GitHub Pages artifact independent of the Cloudflare public site. Its build MUST retain the existing Product and Architecture snapshot routes and approved E2E summary boundary, and MUST NOT add a server-side runtime or ProductShape runtime dependency.

#### Scenario: Both publication outputs are built
- **WHEN** the public site and engineering portal builds complete
- **THEN** each produces a separate static artifact for its configured host and neither artifact contains the other's routes or output files
