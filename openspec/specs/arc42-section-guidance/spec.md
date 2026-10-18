# arc42-section-guidance Specification

<!-- pdac-scope: cited -->

## Purpose

Gives AI assistants focused arc42 section knowledge for evidence-based architecture documentation, with references that can be selected by task and extended by maintainers.

## Requirements

### Requirement: Provide guidance for every standard arc42 section

ArcShape SHALL provide section and relevant subsection guidance for all twelve standard arc42 sections. Each section SHALL have a main `README.md`; project documentation MAY omit, combine, or adapt sections.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

#### Scenario: Use guidance for an adapted architecture document

- **WHEN** a maintainer requests creation or maintenance of documentation for a project that omits, combines, or adapts arc42 sections
- **THEN** the assistant uses the relevant section reference while preserving the project's chosen structure

### Requirement: Select only task-relevant section references

The architecture skill SHALL direct the assistant to relevant section and subsection references without requiring all detailed guidance in context at once.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
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
