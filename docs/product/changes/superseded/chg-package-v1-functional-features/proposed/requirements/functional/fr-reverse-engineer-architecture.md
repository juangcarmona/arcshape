---
id: FR-REVERSE-ENGINEER-ARCHITECTURE
type: functional-requirement
title: Derive and Refine Architecture Documentation from Repository Evidence
status: active
derived-from:
  - UC-REVERSE-ENGINEER-ARCHITECTURE
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
verification:
  - scenario: A maintainer can request an initial architecture proposal based on Markdown sources and any other available repository evidence, regardless of implementation language.
  - scenario: A maintainer can resume bounded analysis rounds and review evidence, conflicts, leads, and unresolved questions.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must use available repository evidence to help maintainers derive an initial understanding of a system's architecture and refine existing Markdown architecture documentation, independent of implementation language. Analysis must proceed in resumable, bounded rounds: inventory sources; classify and prioritize evidence; extract and reconcile findings; track leads and open questions; and report coverage and remaining gaps. The maintainer reviews proposed changes and resolves uncertainty. ArcShape must identify material evidence gaps or conflicts rather than presenting unsupported conclusions as facts.

## Rationale

Reverse engineering helps a maintainer start from an existing system, while refinement keeps the documentation useful as evidence and understanding change. Bounded, resumable rounds make large repositories manageable and preserve analysis progress. Repository evidence can describe implementation but does not by itself establish every product or design intention.
