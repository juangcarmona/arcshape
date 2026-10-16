---
title: Runtime view
arc42-section: "06"
description: Runtime behavior and important interactions between building blocks.
---

# 6. Runtime view

## Runtime scenarios

### Initialize a repository

```mermaid
accTitle: Safe ArcShape initialization flow
sequenceDiagram
    actor Maintainer
    participant CLI as arcshape init
    participant FS as Target repository
    participant Templates as Package templates
    Maintainer->>CLI: init [--target path]
    CLI->>Templates: Read README and arc42 Markdown files
    loop Each template file
        CLI->>FS: Check target path and existing content
        alt File is absent
            CLI->>FS: Create file exclusively
        else Target file exists
            alt Contents match
                CLI-->>Maintainer: Report unchanged
            else Contents differ or path is a symlink
                CLI-->>Maintainer: Report conflict and preserve file
            end
        end
    end
    CLI-->>Maintainer: Summarize created files and conflicts
```

Initialization does not inspect source code, make architecture claims, or contact an ArcShape service. It works in a non-Git directory as well as a Git repository.

### Build the reader site

`arcshape site build` reads the README and twelve Markdown sections, validates their frontmatter and filenames, converts Markdown to sanitized HTML, pre-renders accessible Mermaid diagrams, and writes `docs/architecture-site/index.html`. It does not modify canonical Markdown.

### Resume an evidence-analysis session

`arcshape session start` inventories safe regular files and assigns stable evidence IDs. `session next` returns one bounded round at a time, starting with documentation, then repository configuration, then implementation and tests. `status`, `next`, and `report` refresh file hashes to identify additions, modifications, and removals. A `mark` operation records a classification and an optional note; changed evidence requires re-reading and explicit acceptance before it can be classified. Leads and questions are stored as supplied by the human or AI workflow.
