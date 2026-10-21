---
title: Introduction and goals
arc42-section: "01"
description: System purpose, stakeholders, and architecture goals.
---

# 1. Introduction and goals

## Requirements overview

ArcShape is an npm package with a deterministic CLI and a separately managed package of provider-neutral agent skills for creating and maintaining Markdown architecture documentation. The CLI provides `arcshape init` to scaffold the arc42 structure and optionally install selected skills, `arcshape agents` to detect providers and manage skill files, `arcshape session` to track resumable evidence rounds, `arcshape validate` to validate arc42 Markdown structure, `arcshape sync obsidian` and `arcshape sync confluence` to synchronize architecture documentation, and `arcshape site build` to render a self-contained reader site. Four `arc-` skills support repository reverse engineering, arc42 maintenance, ADRs, C4 diagrams, and documentation connections. Seven provider adapters target Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot.

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:c640cc080f41323f458ac4e1a6124b802277bca2baa73c80fd720df48b286623" -->

## Quality goals

| Priority | Goal                                       | Architectural response                                                                                                    |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| 1        | Preserve authored documentation            | Initialization never overwrites files whose contents differ from package templates.                                       |
| 2        | Keep architecture claims evidence-grounded | The session CLI records evidence coverage and drift; assistant workflows interpret evidence and leave changes reviewable. |
| 3        | Work across repositories                   | The package does not select repositories by programming language; coverage follows available evidence.                    |
| 4        | Make documentation readable                | Markdown remains canonical and the reader site is generated from it.                                                      |

The session CLI, reader site, and portable capability package implement parts of the accepted direction. Skills guide interpretation and authoring but do not accept documentation on the maintainer's behalf.

<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->

## Stakeholders

| Stakeholder           | Need                                                                |
| --------------------- | ------------------------------------------------------------------- |
| Repository maintainer | Install the tool and retain control of documentation changes.       |
| Agent providers       | Discover and run selected ArcShape skills using repository context. |
| Architecture reader   | Understand the system through a navigable, self-contained view.     |

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->
