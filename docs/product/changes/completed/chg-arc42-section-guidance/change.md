---
id: CHG-ARC42-SECTION-GUIDANCE
type: product-change
title: Add section-specific arc42 guidance to AI documentation workflows
status: applied
base-revision: '602f96ba15bd11089de76708d780d71e388cbb0b'
operations:
  add: []
  modify:
    - CON-ARC42-FRAMEWORK
    - FR-ARC42-DOCUMENTATION
    - FR-ASSISTED-WORKFLOWS
    - UC-CREATE-ARCHITECTURE-DOCS
    - UC-MAINTAIN-ARCHITECTURE-DOCS
    - UC-REVERSE-ENGINEER-ARCHITECTURE
  remove: []
---

## Problem

The accepted Product Definition says ArcShape uses arc42 for architecture documentation, but it does not identify the supported section coverage or describe how the AI assistant uses section-specific knowledge to produce useful documentation. The architecture skill follows the twelve numbered sections, while the arc42 reference site provides section and subsection contents, practical tips, and examples that can help an assistant identify what information to look for and what to do when evidence is incomplete. This product behavior is not yet explicit in the definition.

## Intended Product Outcome

ArcShape's architecture-documentation workflows are supported by section-specific arc42 guidance covering all twelve standard sections and their relevant subsections. The guidance helps AI assistants understand each section's purpose, identify and organize relevant repository or maintainer evidence, and recognize when they need to ask for clarification instead of inventing missing information. Relevant arc42 tips and examples inform the guidance, with source attribution and applicable licensing preserved.

The section-specific knowledge supports the complete architecture-documentation outcome across evidence analysis, initial creation, and maintenance. It is not limited to an isolated operation the maintainer must request section by section. The material is organized so all detailed section guidance does not need to be present in the AI's context at once, and can be extended with additional related guidance for a section. This outcome does not prescribe a particular skill count, file tree, frontmatter, or loading mechanism.

Guidance coverage for all twelve sections does not require every generated architecture document to contain every section. A project's documentation may omit, combine, or adapt sections to fit its needs.

## Rationale

Arc42 provides more than a set of headings: its [section documentation](https://docs.arc42.org/) explains expected content and includes tips and examples. The referenced site identifies its content as licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Making that knowledge part of ArcShape's documented product behavior gives assistants a clearer basis for gathering and organizing evidence across the architecture-documentation workflow while retaining the maintainer's authority over unresolved intent and proposed changes. Source-derived content must preserve attribution and comply with applicable license terms.

## Affected Product Areas

- The arc42 framework coverage ArcShape supports.
- AI-assisted evidence analysis and architecture-documentation creation and maintenance.
- The repository maintainer's review of evidence-grounded architecture proposals.

## Open Questions

None.

## Product Acceptance

- The accepted definition names all twelve standard arc42 sections as the coverage baseline for section-specific guidance.
- The accepted definition includes relevant subsections and explains how the section and subsection guidance helps identify useful evidence and handle gaps or conflicts.
- The definition explains how section-specific knowledge supports the full architecture-documentation workflow, including evidence analysis, creation, and maintenance, while keeping unsupported claims and unresolved intent visible to the maintainer.
- The definition requires relevant arc42 tips and examples to inform the guidance and requires applicable source attribution and licensing to be preserved.
- The definition requires the guidance to be organized so all detailed section and subsection material need not be loaded into AI context at once, without requiring a particular skill or file organization.
- The definition allows project-specific architecture documentation to omit, combine, or adapt sections while retaining guidance coverage for all twelve standard sections.
- The definition allows additional related guidance to extend an individual section's material.

## Out of Scope

- Implementation details such as the number of skills, exact folder and README layout, frontmatter fields, reference-selection behavior, or provider-specific adapters.
- Changing the arc42 framework or adding coverage for another architecture framework.
- Defining section-specific content for ADR or C4 workflows.
- Copying full arc42 examples into adopter repositories or changing the authority of repository evidence and maintainer-supplied intent.
