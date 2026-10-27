---
id: CON-NO-ARCSHAPE-DATA-COLLECTION
type: constraint
title: Do Not Collect User or Repository Data for an ArcShape Service
status: active
applies-to:
  - UC-ONBOARD-REPOSITORY
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
  - UC-PUBLISH-ARCHITECTURE-VIEW
  - UC-LINK-PRODUCT-DEFINITION
  - UC-CREATE-ADRS
  - UC-CREATE-C4-DIAGRAMS
  - UC-CREATE-ARCHITECTURE-DIAGRAMS
  - UC-REVERSE-ENGINEER-ARCHITECTURE
  - UC-SYNC-ARCHITECTURE-DOCS
---

## Constraint

ArcShape must not collect or transmit user or repository information to an ArcShape-operated service. The product does not provide a hosted service for this purpose. How an external AI provider processes context under the user's account is outside ArcShape's control and is not a product guarantee.

## Rationale

ArcShape is an installable repository tool, and its maintainer does not intend to gather information from people who install or use it. AI-provider handling remains the user's responsibility under their provider account and settings.

## Consequences

ArcShape functionality must not depend on collecting user or repository data in an ArcShape service. Documentation must not imply that ArcShape controls, limits, or guarantees external provider data practices.
