---
title: Cross-cutting concepts
arc42-section: "08"
description: Concepts and rules that affect multiple building blocks.
---

# 8. Cross-cutting concepts

## Domain model

Product intent, system behavior, quality constraints, and architecture records have separate owners. The ProductShape model states what ArcShape should do; architecture Markdown explains how this repository realizes it.

<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->

## Security and privacy

Repository setup, validation, site generation, session state, and Obsidian sync operate locally. Confluence sync sends only the selected architecture Markdown to the explicitly configured page when run without `--dry-run`; credentials are read from environment variables and are not persisted. Initialization refuses to overwrite differing authored files and refuses to write through symlinked paths. Assistant skills are local Markdown instructions; external AI providers have their own data handling policies.

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## Observability and operations

The CLI reports created, unchanged, updated, orphaned, and conflicting files for local sync. Initialization is repeatable and has no persistent service state. Analysis sessions and Confluence sync baselines are stored locally under `.arcshape/`.
