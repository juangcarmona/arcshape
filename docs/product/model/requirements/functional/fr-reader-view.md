---
id: FR-READER-VIEW
type: functional-requirement
title: Present Architecture Documentation as a Reader-Friendly Web View
status: active
derived-from:
  - UC-PUBLISH-ARCHITECTURE-VIEW
  - UC-READ-ARCHITECTURE
verification:
  - scenario: A maintainer can generate a web view from available architecture documentation.
  - scenario: A reader can navigate the view to find architecture information relevant to a question.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Requirement

ArcShape must generate a static web-based view of architecture documentation in the repository, intended to be understandable to both technical and non-technical readers. The repository maintainer chooses where to host the generated view.

## Rationale

Architecture documentation should communicate the system beyond the people who implement it without requiring ArcShape itself to host the generated view.
