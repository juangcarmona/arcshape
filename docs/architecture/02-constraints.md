---
title: Architecture constraints
arc42-section: "02"
description: Technical, organizational, and convention constraints that shape the architecture.
---

# 2. Architecture constraints

## Technical constraints

- The package targets Node.js 22 or newer and uses npm packaging.
- Architecture documentation, ADRs, and diagram sources use Markdown as their canonical form.
- The first assistant integrations are Codex and Claude.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:f4289478d4678ba40962a5599539b7db614bbaa9f68f2ece81d2d0a226a4f030" -->

## Organizational constraints

- Repository maintainers review proposed architecture documentation before accepting it.
- ArcShape does not operate a hosted service to inspect or store adopter repositories.
- External publication or synchronization must be directed and reviewed by the maintainer.

<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## Conventions

- Keep canonical architecture sources portable Markdown in `docs/architecture/`.
- Keep the twelve arc42 sections in their standard order.
- Mark uncertainty and separate observed implementation from product intent.
