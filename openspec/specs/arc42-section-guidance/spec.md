# arc42-section-guidance Specification

<!-- pdac-scope: cited -->

## Purpose

Gives AI assistants focused arc42 section knowledge for evidence-based architecture documentation, with references that can be selected by task and extended by maintainers.

## Requirements

### Requirement: Provide guidance for every standard arc42 section

ArcShape SHALL provide guidance for all twelve standard arc42 sections and relevant subsections. Each section SHALL use a numbered lowercase kebab-case folder with a main `README.md`; projects MAY omit, combine, or adapt sections.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

#### Scenario: Use guidance for an adapted architecture document

- **WHEN** a maintainer requests creation or maintenance of documentation for a project that omits, combines, or adapts arc42 sections
- **THEN** the assistant uses the relevant section reference while preserving the project's chosen structure

#### Scenario: Navigate section topics

- **WHEN** an assistant needs detailed guidance within a section
- **THEN** it follows links from that section's `README.md` to focused topic documents

### Requirement: Select only task-relevant section references

The architecture skill SHALL direct the assistant to relevant section and subsection references without requiring all detailed guidance in context at once.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:fb9d6549efa4555755042489cd9eda2439cf6afad7d0171663ef2b9edeecd33d" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

#### Scenario: Work on one section or subsection

- **WHEN** the requested task concerns a particular arc42 section or subsection
- **THEN** the assistant reads that section's main reference and only the additional linked references relevant to the task

#### Scenario: Work across multiple sections

- **WHEN** evidence or a requested change affects multiple sections
- **THEN** the assistant reads the relevant references and does not need to load unrelated section details

### Requirement: Guide evidence and evidence gaps by section

Each section reference SHALL help identify relevant evidence and explain how to expose missing or conflicting evidence for maintainer resolution.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->

#### Scenario: Surface missing or conflicting evidence

- **WHEN** repository evidence does not establish useful section content or contains material conflicts
- **THEN** the assistant identifies gaps or conflicts and asks for maintainer context rather than presenting unsupported conclusions as facts

### Requirement: Preserve source attribution and licensing for arc42-derived guidance

ArcShape SHALL distinguish workflow instructions from arc42-derived guidance, link the guidance to relevant source pages, and retain required attribution and applicable licensing information.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

#### Scenario: Follow an arc42 tip or example

- **WHEN** section guidance reflects a relevant arc42 tip or example
- **THEN** the reference links to that source and identifies the applicable attribution and license

### Requirement: Provide a complete, selectively loaded tip and example catalog

ArcShape SHALL provide one separately addressable reference for every practical tip and worked example in the pinned arc42 source snapshot. Each reference SHALL preserve the complete source text and link to its source page. Illustrations SHALL link to their upstream `docs.arc42.org` URLs; binary image assets SHALL NOT be bundled in the ArcShape package.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

#### Scenario: Select a relevant tip or example

- **WHEN** a task benefits from a practical arc42 tip or illustrative example
- **THEN** the assistant selects the matching section-local reference and reads no unrelated tip or example details

#### Scenario: Preserve source metadata and example boundaries

- **WHEN** a source tip or example is packaged
- **THEN** its frontmatter identifies kind, title, section, source URL, attribution, license, and source revision; tip references retain IDs and tags where available, and example references state that their system facts are illustrative rather than evidence about another system

#### Scenario: Verify the recorded source snapshot

- **WHEN** the arc42 reference library is checked
- **THEN** its source register identifies the upstream revision and all 12 section pages, 145 tips, and 35 examples have corresponding references and applicable attribution and license

### Requirement: Place ADRs in the repository's canonical ADR collection

The ADR skill SHALL follow the repository's canonical ADR convention and keep each new ADR discoverable in that collection's index.
<!-- pdac:cite id="FR-ADR-WORKFLOWS" digest="sha256:1301b243301cd5655ee38a47d55af3b9713bd2396d6db5d15e50a910d0fb9254" -->

#### Scenario: Create an ADR in a repository with no ADR convention

- **WHEN** a maintainer requests an ADR and the repository has no ADR location or naming convention
- **THEN** the skill creates `docs/architecture/09-architecture-decisions/README.md`, uses sequential `ADR-0001-kebab-case-title.md` filenames below section 09, and gives every record YAML frontmatter for ID, title, status, date, and deciders

#### Scenario: Follow an existing ADR convention

- **WHEN** a maintainer requests an ADR in a repository with an established location or format
- **THEN** the skill preserves that convention and updates its index without creating a parallel collection

#### Scenario: Link architecture decisions to canonical ADRs

- **WHEN** the repository has an arc42 Section 9
- **THEN** Section 9 links to the canonical ADR index and records rather than duplicating their bodies
