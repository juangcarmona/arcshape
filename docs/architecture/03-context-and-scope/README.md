---
title: System scope and context
arc42-section: "03"
description: The system boundary, its users, and its external interfaces.
---

# 3. System scope and context

## Business context

The maintainer owns the repository and decides which proposed documentation changes to accept. A selected agent provider can inspect repository evidence and draft changes using ArcShape's portable skills. Readers consume Markdown directly or use the generated static site. Documentation can be connected to maintainer-selected Obsidian vaults and Confluence Cloud spaces.

ArcShape packages canonical skills separately from the CLI and installs them into `.agents/skills/` for Codex, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, or GitHub Copilot, or into `.claude/skills/` for Claude Code. The CLI detects local evidence, asks the maintainer to select providers, previews file operations, and tracks managed-file hashes. It does not launch agents or contact marketplaces. The CLI supports local Obsidian synchronization and directed Confluence Cloud publication; each external write requires an explicit command and maintainer-selected destination.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->

## Technical context

```mermaid
accTitle: ArcShape system context
C4Context
    title System Context - ArcShape
    Person(maintainer, "Repository maintainer", "Installs ArcShape and reviews proposed documentation")
    System(arcshape, "ArcShape", "Deterministic CLI and portable agent capability package")
    System_Ext(assistants, "Agent providers", "Discover and run selected skills")
    System_Ext(docs, "Obsidian / Confluence", "Optional documentation destinations")
    Rel(maintainer, arcshape, "Uses CLI")
    Rel(assistants, arcshape, "Invokes workflows")
    Rel(arcshape, docs, "Optional publish")
```

The `arcshape init` path is local and can create Markdown scaffold files plus selected skill instructions; it does not contact an ArcShape service or launch an agent. The optional documentation destinations are used by explicit sync commands, and external publication is never implicit in initialization.

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
