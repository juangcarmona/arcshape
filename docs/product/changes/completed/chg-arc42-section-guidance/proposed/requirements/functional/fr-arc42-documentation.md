---
id: FR-ARC42-DOCUMENTATION
type: functional-requirement
title: Create and Maintain Markdown arc42 Architecture Documentation
status: active
derived-from:
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
  - CON-ARC42-FRAMEWORK
verification:
  - scenario: A maintainer can obtain and review arc42 architecture documentation as Markdown structured according to the product's arc42 expectations.
  - scenario: A maintainer can request an update when repository or product evidence changes and review the proposed Markdown documentation changes.
  - scenario: The AI-assisted architecture-documentation workflow can use section- and subsection-specific arc42 guidance across all twelve standard sections to identify relevant information, organize evidence, and surface missing or conflicting evidence.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must help maintainers create and maintain architecture documentation as Markdown for a software repository using the arc42 framework. Markdown files in the repository are the canonical source from which reader-facing views and supported documentation-system connections are generated. The AI-assisted architecture-documentation workflow must be supported by section- and subsection-specific guidance across all twelve standard arc42 sections. The guidance explains each section's purpose and useful content, and helps the assistant identify relevant repository or maintainer evidence, understand where information belongs, and surface uncertainty or gaps for maintainer review. It draws on relevant arc42 tips and examples with source attribution and applicable licensing preserved. It is organized so that all detailed guidance does not need to be included in AI context at once and can be extended with additional related material for each section. Guidance for every section does not require every generated document to contain every section; project-specific omission, combination, or adaptation is supported.

## Rationale

Keeping architecture documentation aligned with a changing system is the central product outcome. Section-specific arc42 knowledge helps the assistant support that outcome throughout evidence analysis, initial documentation, and maintenance, rather than only when a maintainer asks about one section in isolation.
