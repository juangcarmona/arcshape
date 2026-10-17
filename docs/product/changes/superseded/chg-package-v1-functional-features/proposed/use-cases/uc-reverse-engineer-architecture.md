---
id: UC-REVERSE-ENGINEER-ARCHITECTURE
type: use-case
title: Derive and Refine Architecture Documentation from Repository Evidence
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors:
  - ACT-AI-ASSISTANT
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by:
  - BR-PRODUCT-DEFINITION-AUTHORITY
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-APPROVED-PRODUCT-DEFINITION
---

## Goal

The maintainer obtains architecture documentation grounded in the repository and can refine it as understanding of the system improves.

## Trigger

The maintainer starts documentation for an unfamiliar repository, or asks to improve existing architecture documentation using current repository evidence.

## Preconditions

The repository and any existing architecture documentation are available for analysis. The maintainer can review proposed changes and answer questions about intent that code alone cannot establish.

## Main Flow

1. The maintainer requests an initial architecture description or a refinement of existing documentation.
2. ArcShape inventories available sources and groups them into bounded, prioritized analysis rounds.
3. In each round, ArcShape examines the sources, distinguishes documented intent from observed behavior and inference, reconciles duplicate or conflicting findings, and records leads and questions.
4. ArcShape reports round coverage and remaining work so analysis can be resumed or continued with the next round.
5. ArcShape prepares a proposal for the applicable Markdown architecture documentation and explains unresolved evidence gaps.
6. The maintainer reviews the evidence and proposal, provides corrections or context, and decides what to accept.

## Alternative Flows

When repository evidence is insufficient or conflicting, ArcShape records the question and evidence, asks for maintainer context, and leaves uncertain claims unresolved rather than presenting them as established facts. The analysis can be paused and resumed without losing recorded progress.

## Failure Conditions

Repository evidence cannot be accessed or is insufficient to prepare a useful proposal, and the maintainer cannot supply the missing context.

## Postconditions

The maintainer has a reviewable, evidence-grounded Markdown documentation proposal and a report of processed sources, open leads, questions, and remaining work, or a prioritized account of the information still needed.
