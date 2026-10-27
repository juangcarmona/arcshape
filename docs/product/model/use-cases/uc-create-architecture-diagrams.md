---
id: UC-CREATE-ARCHITECTURE-DIAGRAMS
type: use-case
title: Create and Maintain Architecture Diagrams
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors:
  - ACT-AI-ASSISTANT
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by:
  - BR-PRODUCT-DEFINITION-AUTHORITY
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Goal

The maintainer explains architecture structure and behavior with reviewable diagrams that remain consistent with repository evidence.

## Trigger

The maintainer requests a new diagram, an update, or conversion of selected existing diagrams to the native interactive experience.

## Preconditions

Repository evidence and any existing diagram sources are available. The maintainer can review the proposed source and its rendered presentation.

## Main Flow

1. The maintainer identifies the architectural question and any preferred diagram family or engine.
2. The assistant examines repository evidence and relevant approved product intent, identifies elements and relationships, and records unresolved assumptions.
3. The assistant selects a supported representation that preserves the required meaning, respecting explicit maintainer choices.
4. The assistant authors one editable diagram source within the canonical Markdown documentation and invokes deterministic validation and rendering.
5. The assistant inspects the rendered diagram for readable labels, relationships, layout and interaction, and presents the source changes and visual evidence.
6. The maintainer reviews the proposal and decides what to accept.

## Alternative Flows

- C4 requests retain the context, container, component or code perspective described by UC-CREATE-C4-DIAGRAMS; they need not reproduce C4's exact visual notation.
- When the native renderer cannot express required semantics, the assistant explains the limitation and proposes Mermaid. Explicit engine choices are respected; incompatible requests are reported for maintainer resolution.
- During migration, the assistant compares meaning before and after conversion. Diagrams that cannot be faithfully converted remain unchanged Mermaid. Partial migration and mixed-engine documents are supported.
- Without enough evidence, the assistant records gaps and requests context rather than inventing architecture.

## Failure Conditions

The necessary evidence is unavailable or contradictory; no supported representation preserves the required meaning; validation or rendering fails; or rendered inspection cannot establish that the proposal is readable. A failed conversion must not overwrite the original source.

## Postconditions

The maintainer has a reviewable diagram proposal, validation and visual evidence, or an actionable explanation of the unresolved evidence or representation problem.
