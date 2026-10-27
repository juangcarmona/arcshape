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
  - scenario: A maintainer can review native context, container and component diagrams that preserve C4 abstraction levels without requiring its exact visual notation.
  - scenario: Existing Mermaid C4 diagrams and supported Mermaid alternatives remain usable when a requested native representation is unavailable.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Requirement

ArcShape must help maintainers create and maintain C4 diagrams that communicate the system's architecture and can be reviewed alongside repository documentation.

Native diagrams must retain the distinction between system context, containers and components, even when they use a different visual vocabulary from conventional C4 notation. Mermaid remains supported, including for code views or other features outside native coverage. Creation and conversion preserve architectural meaning and remain reviewable; the rendered appearance is not evidence that a system claim is correct.

## Rationale

C4 diagrams provide complementary views of system context, containers, components, and code organization within the architecture documentation.
