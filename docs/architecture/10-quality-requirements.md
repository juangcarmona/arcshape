---
title: Quality requirements
arc42-section: "10"
description: Quality goals and concrete scenarios for evaluating them.
---

# 10. Quality requirements

## Quality tree

- **Safety:** protect user-authored files and avoid unintended external data transfer.
- **Portability:** use Markdown sources that remain readable outside ArcShape.
- **Usability:** make setup and conflicts understandable to maintainers.
- **Traceability:** connect product-intent statements to ProductShape and implementation claims to repository evidence.

<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## Quality scenarios

| Scenario                                      | Expected response                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Run initialization twice without changes      | The second run reports all scaffold files as unchanged and makes no content changes.    |
| A maintainer already authored one target file | ArcShape reports a conflict, preserves the file, and continues with other absent files. |
| The architecture path contains a symlink      | ArcShape reports the conflict and does not write through it.                            |

## CI assurance scenarios

| Scenario                                                  | Expected response                                                                                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Run the onboarding and reader E2E journey                 | A temporary repository is initialized, authored architecture content is generated, and the browser can reach and read the updated section through a local preview. |
| Add a synthetic High-risk alert to the ZAP report fixture | The severity-policy self-test proves that High fails while Medium remains report-only.                                                                             |
| Run the scheduled/manual mutation baseline                | Stryker records killed, survived, timed-out, and uncovered mutants for the selected high-risk modules and retains the JSON/HTML reports.                           |
| Consider making assurance a required merge check          | A maintainer reviews observed thresholds, severity, runtime, and flakiness before any ruleset update.                                                              |
| Run in a directory without Git metadata                   | Initialization still creates the Markdown workspace.                                                                                                               |
