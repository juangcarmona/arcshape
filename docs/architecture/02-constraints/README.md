---
title: Architecture constraints
arc42-section: "02"
description: Technical, organizational, and convention constraints that shape the architecture.
---

# 2. Architecture constraints

## Technical constraints

- The package targets Node.js 22 or newer and uses npm packaging.
- Architecture documentation, ADRs, and diagram sources use Markdown as their canonical form.
- Agent workflows use portable Agent Skills with provider adapters. Codex, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot share `.agents/skills/`; Claude Code uses `.claude/skills/`.
- Provider compatibility follows each provider's documented discovery paths; ArcShape does not claim runtime testing inside provider applications.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

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
