---
id: UC-MANAGE-AGENT-CAPABILITIES
type: use-case
title: Select and Manage ArcShape Agent Capabilities
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors: []
governed-by: []
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Goal

The maintainer makes the selected ArcShape agent capabilities available at the appropriate scope for the repository.

## Trigger

The maintainer initializes ArcShape, adds an agent provider, or requests an update or removal of ArcShape capabilities.

## Preconditions

ArcShape is available through its npm package, and the target repository is accessible.

## Main Flow

1. ArcShape checks for supported agent providers and relevant repository configuration.
2. ArcShape reports the providers it detected and the signals used.
3. The maintainer selects one or more providers, capabilities, and an available installation scope.
4. ArcShape shows the files and changes planned for the selection, including existing-file conflicts.
5. The maintainer confirms the plan.
6. ArcShape installs or updates the selected capabilities and reports the result.

## Alternative Flows

- If no provider is detected, interactive onboarding asks the maintainer to select one. Non-interactive onboarding requires an explicit provider-selection option.
- If the provider supports both project and user scope, project scope is proposed by default and the maintainer can select a different supported scope.
- When an existing managed file has been edited, ArcShape preserves it and offers a reviewable resolution rather than overwriting it.
- During removal, ArcShape deletes only unchanged files it can identify as ArcShape-managed and reports edited files for manual review.

## Failure Conditions

No supported adapter exists for the selected provider or scope; the package lacks required capability files; the maintainer declines the plan; or a file conflict prevents a safe update.

## Postconditions

The selected capabilities are installed or updated at the chosen scope, or the maintainer receives a report of preserved files, conflicts, and any remaining manual actions.
