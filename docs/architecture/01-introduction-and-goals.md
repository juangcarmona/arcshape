---
title: Introduction and goals
arc42-section: "01"
description: System purpose, stakeholders, and architecture goals.
---

# 1. Introduction and goals

## Requirements overview

ArcShape is an npm package with a CLI and Codex and Claude workflows for creating and maintaining Markdown architecture documentation. The CLI provides `arcshape init` to scaffold the arc42 structure and install assistant workflows, `arcshape session` to track resumable evidence rounds, `arcshape validate` to validate arc42 Markdown structure, `arcshape sync obsidian` and `arcshape sync confluence` to synchronize architecture documentation, and `arcshape site build` to render a self-contained reader site. The assistant workflows support repository reverse engineering, arc42 maintenance, ADRs, C4 diagrams, and documentation connections.

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:bb1a262b20b924f2bea45e81078452163f836c466ae379e934933b5c06fa4f36" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:c640cc080f41323f458ac4e1a6124b802277bca2baa73c80fd720df48b286623" -->

## Quality goals

| Priority | Goal                                       | Architectural response                                                                                                    |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| 1        | Preserve authored documentation            | Initialization never overwrites files whose contents differ from package templates.                                       |
| 2        | Keep architecture claims evidence-grounded | The session CLI records evidence coverage and drift; assistant workflows interpret evidence and leave changes reviewable. |
| 3        | Work across repositories                   | The package does not select repositories by programming language; coverage follows available evidence.                    |
| 4        | Make documentation readable                | Markdown remains canonical and the reader site is generated from it.                                                      |

The session CLI, reader site, and assistant workflow scaffolding implement parts of the accepted direction. The assistant workflows guide interpretation and authoring but do not accept documentation on the maintainer's behalf.

<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->

## Stakeholders

| Stakeholder           | Need                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Repository maintainer | Install the tool and retain control of documentation changes.                                |
| Codex or Claude       | Use local evidence and deterministic CLI operations to help maintain Markdown documentation. |
| Architecture reader   | Understand the system through a navigable, self-contained view.                              |

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7dcae213a0ff556824ec2da92ee977447f007034d8f5b308ebcdd5851c9a5035" -->
