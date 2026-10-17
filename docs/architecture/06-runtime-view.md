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
    CLI->>Templates: Read arc42 and assistant workflow Markdown files
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

Initialization does not inspect source code, make architecture claims, or contact an ArcShape service. It installs the README and twelve arc42 sections plus Codex and Claude commands and skills. It works in a non-Git directory as well as a Git repository.

### Validate architecture Markdown

`arcshape validate` loads the architecture README and twelve numbered sections and checks the arc42 frontmatter contract. It can print a human-readable summary or machine-readable JSON. Site generation runs the same structural validation before writing HTML.

### Synchronize with an Obsidian vault

`arcshape sync obsidian --vault <path>` copies Markdown files from the architecture directory to a selected vault folder. Repeatable `--include` options add selected Markdown directories such as `docs/adr`; ArcShape preserves a shared relative directory structure so links between the selected documents continue to work. A local manifest records content hashes. On later runs, ArcShape updates a note only when its current content still matches the last synced version; local edits are reported as conflicts. Source files removed from the repository are reported as orphaned vault notes and are not deleted.

`arcshape sync confluence --base-url <url> --space-id <id> --parent-id <id>` reads the selected parent page and publishes an index plus one child page per arc42 section. Repeatable `--include` options add selected Markdown files or directories such as ADRs. `--dry-run` reports create, update, unchanged, and conflict actions without writing. A local manifest tracks each managed page and protects remote edits from being overwritten. The single-page `--page-id` mode remains available. Credentials are read from configured environment variable names and are not stored in the repository.

### Build the reader site

`arcshape site build` reads the README and twelve Markdown sections, validates their frontmatter and filenames, converts Markdown to sanitized HTML, pre-renders accessible Mermaid diagrams, and writes `docs/architecture-site/index.html`. It does not modify canonical Markdown.

### Resume an evidence-analysis session

`arcshape session start` inventories safe regular files and assigns stable evidence IDs. `session next` returns one bounded round at a time, starting with documentation, then repository configuration, then implementation and tests. `status`, `next`, and `report` refresh file hashes to identify additions, modifications, and removals. A `mark` operation records a classification and an optional note; changed evidence requires re-reading and explicit acceptance before it can be classified. Leads and questions are stored as supplied by the human or AI workflow.
