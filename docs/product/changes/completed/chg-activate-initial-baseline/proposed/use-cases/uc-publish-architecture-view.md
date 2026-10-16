---
id: UC-PUBLISH-ARCHITECTURE-VIEW
type: use-case
title: Generate an Architecture View
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors: []
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by: []
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Goal

The maintainer makes architecture documentation available in a form that readers can understand.

## Trigger

The maintainer wants to share or review architecture documentation as a reader-facing view.

## Preconditions

Architecture documentation is available for presentation.

## Main Flow

1. The maintainer requests a reader-facing architecture view.
2. ArcShape presents the architecture documentation in a web view.
3. The maintainer can inspect the resulting view and share it through the supported means.

## Alternative Flows

The first release generates the static view in the repository. Hosting is the repository maintainer's choice and is not provided by ArcShape.

## Failure Conditions

The available documentation cannot be presented, or the resulting view omits required information.

## Postconditions

A reader-facing architecture view is available, or the maintainer receives an explanation of why it could not be generated.
