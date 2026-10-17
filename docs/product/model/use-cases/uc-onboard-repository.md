---
id: UC-ONBOARD-REPOSITORY
type: use-case
title: Onboard a Repository
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors: []
governed-by: []
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Goal

The maintainer makes ArcShape available in a repository for architecture-documentation work.

## Trigger

The maintainer decides to begin or resume architecture-documentation work for the repository.

## Preconditions

The maintainer can access the repository and the ArcShape distribution method supported for the target environment.

## Main Flow

1. The maintainer selects ArcShape for the repository.
2. ArcShape establishes the repository context needed for its documented workflows.
3. ArcShape detects available agent providers and shows the evidence for each detection.
4. The maintainer selects the providers and capabilities to install, reviews the plan, and confirms it.
5. The maintainer can begin architecture-documentation work through the selected interfaces.

## Alternative Flows

If no provider is detected, interactive onboarding asks the maintainer to choose; non-interactive use requires explicit provider selection. If agent integration is not desired, the maintainer can continue with the deterministic CLI only. The depth of architecture analysis supported for different repository stacks remains open.

## Failure Conditions

The target repository environment is unsupported, onboarding cannot establish the required context, or a selected provider has no supported adapter for the requested capability.

## Postconditions

The repository is ready for the supported ArcShape workflows, or the maintainer receives an understandable explanation of why it is not.
