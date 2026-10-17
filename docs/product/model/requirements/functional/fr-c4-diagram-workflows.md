---
id: FR-C4-DIAGRAM-WORKFLOWS
type: functional-requirement
title: Create and Maintain C4 Architecture Diagrams
status: active
derived-from:
  - UC-CREATE-C4-DIAGRAMS
verification:
  - scenario: A maintainer can prepare reviewable C4 diagrams using repository evidence and maintainer context.
  - scenario: A maintainer can update C4 diagrams when relevant architecture evidence changes.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Requirement

ArcShape must help maintainers create and maintain C4 diagrams that communicate the system's architecture and can be reviewed alongside repository documentation.

## Rationale

C4 diagrams provide complementary views of system context, containers, components, and code organization within the architecture documentation.
