---
title: Runtime view
arc42-section: "06"
description: Runtime behavior and important interactions between building blocks.
---

# 6. Runtime view

## Runtime scenarios

### Initialize a repository

```mermaid
sequenceDiagram
    accTitle: Safe ArcShape initialization flow
    participant Maintainer as Maintainer
    participant CLI as ArcShape CLI
    participant Package as Installed package
    participant FS as Target repository
    Maintainer->>CLI: Request init
    CLI->>Package: Load scaffold and selected skills
    CLI-->>Maintainer: Show scope, actions, and conflicts
    Maintainer->>CLI: Confirm plan
    loop Each planned file action
        CLI->>FS: Recheck path and content
        alt File is absent
            CLI->>FS: Create exclusively
        else Contents match
            CLI-->>Maintainer: Keep unchanged
        else Edited or symlinked
            CLI-->>Maintainer: Preserve and report conflict
        end
    end
    CLI-->>Maintainer: Report created, unchanged, and preserved files
```

Initialization is preview-first and deliberately boring: it does not inspect source code, make architecture claims, contact an ArcShape service, or launch an agent. It installs the README, twelve arc42 sections, and optionally selected `arc-` skills. The CLI rechecks each destination before writing, creates absent files exclusively, and preserves edited or symlinked paths as conflicts. Agent lifecycle commands use the same planning and ownership-manifest approach.

### Validate architecture Markdown

`arcshape validate` loads the architecture README and twelve numbered sections. New adopters use one `NN-slug/README.md` directory per section and may add supporting Markdown there; the legacy flat layout remains compatible during migration. The command checks the arc42 frontmatter contract and can print a human-readable summary or machine-readable JSON. Site generation runs the same structural validation before writing HTML.

### Synchronize with an Obsidian vault

`arcshape sync obsidian --vault <path>` copies Markdown files from the architecture directory to a selected vault folder. Repeatable `--include` options add selected Markdown directories such as `docs/architecture/09-architecture-decisions`; ArcShape preserves a shared relative directory structure so links between the selected documents continue to work. A local manifest records content hashes. On later runs, ArcShape updates a note only when its current content still matches the last synced version; local edits are reported as conflicts. Source files removed from the repository are reported as orphaned vault notes and are not deleted.

`arcshape sync confluence --base-url <url> --space-id <id> --parent-id <id>` reads the selected parent page and publishes an index plus one child page per arc42 section. Repeatable `--include` options add selected Markdown files or directories such as ADRs. `--dry-run` reports create, update, unchanged, and conflict actions without writing. A local manifest tracks each managed page and protects remote edits from being overwritten. The single-page `--page-id` mode remains available. Credentials are read from configured environment variable names and are not stored in the repository.

### Build the reader site

`arcshape site build` reads the README, twelve canonical section documents, and any supporting Markdown beneath their section directories, validates their frontmatter and filenames, converts Markdown to sanitized HTML, pre-renders accessible Mermaid diagrams, and writes the requested output file (default `docs/architecture-site/index.html`). Supporting Markdown keeps its authored relative paths in the reader: nested folders become collapsible navigation groups, folder `README.md` files provide folder pages, and supporting pages show contextual breadcrumbs. The GitHub Pages workflow writes its projection to `_site/architecture/index.html` with the exact source revision. It does not modify canonical Markdown.

Native fences add one build-time rendering step. The default snapshot embeds their static images; `--format interactive` publishes compact viewers and dedicated pages from the same source. Validation or rendering errors stop publication. An interactive directory is replaced only when its ownership inventory still matches every file. Sequence diagrams remain Mermaid because ordered messages and fragments are outside the initial enhancement subset.

```mermaid
sequenceDiagram
  accTitle: Build native architecture diagrams
  participant maintainer as Maintainer
  participant site as Site builder
  participant renderer as Native adapter
  participant browser as Build browser
  participant output as Owned output
  maintainer->>site: Build interactive site
  site->>renderer: Classify Mermaid and validate sources
  renderer->>browser: Render HTML and export SVG
  browser-->>renderer: Static image
  renderer-->>site: Validated render artifacts
  site->>output: Verify ownership and publish
  site-->>maintainer: Report output directory
```

The diagram shows the successful path. Malformed input, a rendering failure, or modified output leaves the prior publication in place. The runtime boundary is explained in [cross-cutting concepts](../08-crosscutting-concepts/README.md); the trade-off is recorded in [ADR-0002](../09-architecture-decisions/ADR-0002-isolate-native-diagram-viewers.md).

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->

The builder first resolves local sidecars and parses Mermaid. Every Mermaid fence uses the Mermaid renderer in the main document. Compatible flows also become native input in memory for separate deep-dive pages; unsupported diagrams receive no Archify link. Native outputs are rendered once, paired previews are checked for freshness, and only then is the complete site published. The source files remain unchanged.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->

### Resume an evidence-analysis session

`arcshape session start` inventories safe regular files and assigns stable evidence IDs. `session next` returns one bounded round at a time, starting with documentation, then repository configuration, then implementation and tests. `status`, `next`, and `report` refresh file hashes to identify additions, modifications, and removals. A `mark` operation records a classification and an optional note; changed evidence requires re-reading and explicit acceptance before it can be classified. Leads and questions are stored as supplied by the human or AI workflow.

### Run risk-based CI assurance

The dedicated assurance workflow runs a Playwright Chromium journey against a temporary initialized repository and generated reader. A separate job builds the reader from the checked-out commit, serves it only on the ephemeral runner, and runs OWASP ZAP Baseline in passive mode. The severity adapter reports all findings and fails for High risk. The weekly and manually dispatched mutation job runs Stryker's Vitest runner against the bounded onboarding and provider-lifecycle modules and retains its report. New assurance check contexts are not required by the `main` ruleset pending maintainer review of measured thresholds and findings.
