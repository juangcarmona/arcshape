---
id: CON-ARC42-FRAMEWORK
type: constraint
title: Use the arc42 Framework for Architecture Documentation
status: active
applies-to:
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Constraint

ArcShape's architecture-documentation workflows use the twelve standard sections of the arc42 framework as the supported guidance baseline: Introduction and Goals; Constraints; Context and Scope; Solution Strategy; Building Block View; Runtime View; Deployment View; Crosscutting Concepts; Architecture Decisions; Quality Requirements; Risks and Technical Debt; and Glossary.

## Rationale

Using the standard arc42 structure gives maintainers and readers a shared framework for architecture documentation. Section-specific knowledge lets the AI assistant use the framework's purpose, content guidance, tips, and examples when helping with architecture evidence and documentation.

## Consequences

ArcShape's AI-assisted architecture-documentation workflows must have guidance coverage for all twelve standard sections. Coverage describes the guidance ArcShape provides; it does not require every generated document to contain all twelve sections. Projects may omit, combine, or adapt sections to fit their needs.
