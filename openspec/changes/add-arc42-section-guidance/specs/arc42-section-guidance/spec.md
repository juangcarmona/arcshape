# Spec Delta

<!-- pdac-scope: cited -->

## MODIFIED Requirements

### Requirement: Provide guidance for every standard arc42 section

ArcShape SHALL provide guidance for all twelve standard arc42 sections and relevant subsections. Each section SHALL use a numbered lowercase kebab-case folder with a main `README.md`; projects MAY omit, combine, or adapt sections.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

#### Scenario: Use guidance for an adapted architecture document
- **WHEN** a maintainer requests creation or maintenance of documentation for a project that omits, combines, or adapts arc42 sections
- **THEN** the assistant follows that structure and uses the relevant section README plus only the linked topic references needed for the task

#### Scenario: Navigate section topics
- **WHEN** an assistant needs detailed guidance within a section
- **THEN** it follows links from that section's `README.md` to focused topic documents

### Requirement: Provide a complete, selectively loaded tip and example catalog

ArcShape SHALL provide one separately addressable reference for every practical tip and worked example in the pinned arc42 source snapshot. Each reference SHALL preserve the complete source content and referenced images and link to its source page.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

#### Scenario: Select a relevant tip or example
- **WHEN** a task benefits from a practical arc42 tip or illustrative example
- **THEN** the assistant selects matching references by section, title, and metadata without loading unrelated source files

#### Scenario: Verify the recorded source snapshot
- **WHEN** the arc42 reference library is checked
- **THEN** the source register identifies the upstream revision and all 12 section pages, 145 tips, and 35 examples have corresponding references and applicable attribution and license

#### Scenario: Preserve source metadata and example boundaries
- **WHEN** a source tip or example is packaged
- **THEN** its frontmatter identifies kind, title, section, source URL, attribution, license, and source revision; tip references retain IDs and tags where available, and example references state that their system facts are illustrative rather than evidence about another system

### Requirement: Place ADRs in the repository's canonical ADR collection

The ADR skill SHALL follow the repository's canonical ADR convention and keep each new ADR discoverable in that collection's index.
<!-- pdac:cite id="FR-ADR-WORKFLOWS" digest="sha256:1301b243301cd5655ee38a47d55af3b9713bd2396d6db5d15e50a910d0fb9254" -->

#### Scenario: Create an ADR in a repository with no ADR convention
- **WHEN** a maintainer requests an ADR and the repository has no established ADR location or format
- **THEN** the skill creates `docs/adr/README.md`, uses sequential `ADR-0001-kebab-case-title.md` filenames, and gives every record YAML frontmatter for ID, title, status, date, and deciders

#### Scenario: Follow an existing ADR convention
- **WHEN** a maintainer requests an ADR in a repository with an established location or format
- **THEN** the skill preserves that convention and updates its index without creating a parallel collection

#### Scenario: Link architecture decisions to canonical ADRs
- **WHEN** the repository has an arc42 Section 9
- **THEN** Section 9 links to the canonical ADR index and records rather than duplicating their bodies
