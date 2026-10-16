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

The CLI operates on the selected local repository and does not upload its contents. Session state remains in `.arcshape/sessions/`. Initialization refuses to overwrite differing authored files and refuses to write through symlinked paths. Assistant skills are local Markdown instructions; external AI providers have their own data handling policies.

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## Observability and operations

The CLI reports each created file, unchanged file, and conflict. Initialization is repeatable and has no persistent service state. Analysis-session progress is stored locally in `.arcshape/sessions/`.
