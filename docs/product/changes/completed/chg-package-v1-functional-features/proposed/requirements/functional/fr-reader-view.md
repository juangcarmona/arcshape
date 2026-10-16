---
id: FR-READER-VIEW
type: functional-requirement
title: Generate an arc42 Architecture Web View
status: active
derived-from:
  - UC-PUBLISH-ARCHITECTURE-VIEW
  - UC-READ-ARCHITECTURE
verification:
  - scenario: A maintainer can generate a static web view from available Markdown arc42 architecture documentation in the repository.
  - scenario: A reader can navigate the view to find architecture information relevant to a question.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Requirement

ArcShape must generate a static web-based view of Markdown arc42 architecture documentation in the repository, intended to be understandable to technical and non-technical readers. Markdown remains the canonical source, and the repository maintainer chooses where to host the generated view.

## Rationale

The web view makes the architecture documentation shareable with system stakeholders without requiring ArcShape to host it.
