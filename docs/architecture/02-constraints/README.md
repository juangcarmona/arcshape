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

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:c49ed716a9b078b766666bf79afa2e999a366a9444732c659691b34baba853e1" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## Organizational constraints

- Repository maintainers review proposed architecture documentation before accepting it.
- ArcShape does not operate a hosted service to inspect or store adopter repositories.
- External publication or synchronization must be directed and reviewed by the maintainer.

<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

## Conventions

- Keep canonical architecture sources portable Markdown in `docs/architecture/`.
- Keep the twelve arc42 sections in their standard order.
- Mark uncertainty and separate observed implementation from product intent.
