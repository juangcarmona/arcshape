---
title: System scope and context
arc42-section: "03"
description: The system boundary, its users, and its external interfaces.
---

# 3. System scope and context

## Business context

The maintainer owns the repository and decides which proposed documentation changes to accept. Codex or Claude can inspect repository evidence and draft changes. Readers consume Markdown directly or use the generated static site. Documentation can be connected to maintainer-selected Obsidian vaults and Confluence Cloud spaces.

ArcShape installs the Codex and Claude workflow commands and skills. The CLI supports local Obsidian synchronization and directed Confluence Cloud publication; each external write requires an explicit command and maintainer-selected destination.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7dcae213a0ff556824ec2da92ee977447f007034d8f5b308ebcdd5851c9a5035" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->

## Technical context

```mermaid
accTitle: ArcShape system context
C4Context
    title System Context - ArcShape
    Person(maintainer, "Repository maintainer", "Installs ArcShape and reviews proposed documentation")
    System(arcshape, "ArcShape", "CLI and assistant workflows for Markdown architecture documentation")
    System_Ext(assistants, "Codex / Claude", "AI workflow hosts")
    System_Ext(docs, "Obsidian / Confluence", "Optional documentation destinations")
    Rel(maintainer, arcshape, "Uses CLI")
    Rel(assistants, arcshape, "Invokes workflows")
    Rel(arcshape, docs, "Optional publish")
```

The `arcshape init` path is local and creates Markdown files only. The optional destinations are used by explicit sync commands; neither assistant workflow execution nor external publication is implicit in initialization.

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
