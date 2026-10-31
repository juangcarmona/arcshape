---
title: Runtime view
arc42-section: "06"
description: Runtime behavior and important interactions between building blocks.
---

# 6. Runtime view

## Runtime scenarios

### Initialize a repository

![Safe ArcShape initialization flow](./diagrams/initialization.png)
<!-- arcshape-diagram-source: ./diagrams/initialization.archify.json -->

The initialization activity view makes the per-file loop and its three mutually exclusive outcomes explicit. Initialization is preview-first and deliberately boring: it does not inspect source code, make architecture claims, contact an ArcShape service, or launch an agent. It installs the README, twelve arc42 sections, and optionally selected `arc-` skills. The CLI rechecks each destination before writing, creates absent files exclusively, and preserves edited or symlinked paths as conflicts. Agent lifecycle commands use the same planning and ownership-manifest approach.

### Validate architecture Markdown

`arcshape validate` loads the architecture README and twelve numbered sections. New adopters use one `NN-slug/README.md` directory per section and may add supporting Markdown there; the legacy flat layout remains compatible during migration. The command checks the arc42 frontmatter contract and can print a human-readable summary or machine-readable JSON. Site generation runs the same structural validation before writing HTML.

### Synchronize with an Obsidian vault

`arcshape sync obsidian --vault <path>` copies Markdown files from the architecture directory to a selected vault folder. Repeatable `--include` options add selected Markdown directories such as `docs/architecture/09-architecture-decisions`; ArcShape preserves a shared relative directory structure so links between the selected documents continue to work. A local manifest records content hashes. On later runs, ArcShape updates a note only when its current content still matches the last synced version; local edits are reported as conflicts. Source files removed from the repository are reported as orphaned vault notes and are not deleted.

`arcshape sync confluence --base-url <url> --space-id <id> --parent-id <id>` reads the selected parent page and publishes an index plus one child page per arc42 section. Repeatable `--include` options add selected Markdown files or directories such as ADRs. `--dry-run` reports create, update, unchanged, and conflict actions without writing. A local manifest tracks each managed page and protects remote edits from being overwritten. The single-page `--page-id` mode remains available. Credentials are read from configured environment variable names and are not stored in the repository.

### Build the reader site

`arcshape site build` reads the README, twelve canonical section documents, and any supporting Markdown beneath their section directories, validates their frontmatter and filenames, converts Markdown to sanitized HTML, pre-renders accessible Mermaid diagrams, and writes the requested output file (default `docs/architecture-site/index.html`). Supporting Markdown keeps its authored relative paths in the reader: nested folders become collapsible navigation groups, folder `README.md` files provide folder pages, and supporting pages show contextual breadcrumbs. The GitHub Pages workflow writes its projection to `_site/architecture/index.html` with the exact source revision. It does not modify canonical Markdown.

Native fences add one build-time rendering step. The default snapshot embeds their static images; `--format interactive` publishes compact viewers and dedicated pages from the same source. Validation or rendering errors stop publication. An interactive directory is replaced only when its ownership inventory still matches every file. The canonical diagrams below use native bundles; existing Mermaid sources remain supported, with whole-diagram fallback for unsupported conversion semantics.

![Build native architecture diagrams](./diagrams/reader-build.png)
<!-- arcshape-diagram-source: ./diagrams/reader-build.archify.json -->

The diagram shows the successful path. Malformed input, a rendering failure, or modified output leaves the prior publication in place. The runtime boundary is explained in [cross-cutting concepts](../08-crosscutting-concepts/README.md); the trade-off is recorded in [ADR-0002](../09-architecture-decisions/ADR-0002-isolate-native-diagram-viewers.md).

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->

The builder resolves native bundle references, checks generated SVG, available or selected PNG and Mermaid Markdown against their canonical JSON, and creates the static or isolated interactive representation. Existing Mermaid fences retain their bounded compatibility conversion. Generated companion-only Markdown is excluded from duplicate navigation. Only after validation succeeds is the complete site published; authored files remain unchanged.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->

### Resume an evidence-analysis session

`arcshape session start` inventories safe regular files and assigns stable evidence IDs. `session next` returns one bounded round at a time, starting with documentation, then repository configuration, then implementation and tests. `status`, `next`, and `report` refresh file hashes to identify additions, modifications, and removals. A `mark` operation records a classification and an optional note; changed evidence requires re-reading and explicit acceptance before it can be classified. Leads and questions are stored as supplied by the human or AI workflow.

### Run risk-based CI assurance

The dedicated assurance workflow runs a Playwright Chromium journey against a temporary initialized repository and generated reader. A separate job builds the reader from the checked-out commit, serves it only on the ephemeral runner, and runs OWASP ZAP Baseline in passive mode. The severity adapter reports all findings and fails for High risk. The weekly and manually dispatched mutation job runs Stryker's Vitest runner against the bounded onboarding and provider-lifecycle modules and retains its report. New assurance check contexts are not required by the `main` ruleset pending maintainer review of measured thresholds and findings.
