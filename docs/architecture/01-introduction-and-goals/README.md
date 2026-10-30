---
title: Introduction and goals
arc42-section: "01"
description: System purpose, stakeholders, and architecture goals.
---

# 1. Introduction and goals

## Requirements overview

ArcShape is a local toolkit for turning a repository into a readable, reviewable architecture workspace. Its npm package provides a deterministic CLI; its optional capability package gives selected agent providers portable instructions for investigating and maintaining the documentation.

| Capability | What the maintainer gets |
| --- | --- |
| Onboard | A twelve-section arc42 scaffold, with optional provider capabilities. |
| Investigate | Resumable evidence sessions that record coverage, changes, findings, and open questions. |
| Maintain | Validation, ADR and C4 authoring workflows, and explicit sync to selected destinations. |
| Read and share | A self-contained reader generated from the canonical Markdown. |

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

## Quality goals

| Priority | Goal                                       | Architectural response                                                                                                    |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| 1        | Preserve authored documentation            | Initialization never overwrites files whose contents differ from package templates.                                       |
| 2        | Keep architecture claims evidence-grounded | The session CLI records evidence coverage and drift; assistant workflows interpret evidence and leave changes reviewable. |
| 3        | Work across repositories                   | The package does not select repositories by programming language; coverage follows available evidence.                    |
| 4        | Make documentation readable                | Markdown remains canonical and the reader site is generated from it.                                                      |

The CLI owns setup, validation, bookkeeping, and rendering. Skills guide investigation and authoring; they do not accept documentation changes on the maintainer's behalf.

<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->

## Stakeholders

| Stakeholder           | Need                                                                |
| --------------------- | ------------------------------------------------------------------- |
| Repository maintainer | Install the tool and retain control of documentation changes.       |
| Agent providers       | Discover and run selected ArcShape skills using repository context. |
| Architecture reader   | Understand the system through a navigable, self-contained view.     |

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->
