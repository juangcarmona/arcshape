# Design

<!-- pdac-scope: cited -->

## Context

See [proposal.md](proposal.md) for the motivation and scope. The shipped skill currently consists of one `SKILL.md` per capability. `bin/agents/lifecycle.mjs` plans, hashes, updates, and removes only that file, and its manifest path check accepts only `SKILL.md`. The package already includes the `capabilities/` tree, and existing tests cover skill installation, user edits, package contents, and arc42 evidence examples.

The applied Product Change `CHG-ARC42-SECTION-GUIDANCE` defines the product behavior. This design lays out how the bundled material and its distribution will support it.

## Goals / Non-Goals

**Goals:**

- Provide predictable paths to focused guidance for each standard arc42 section.
- Keep the skill entrypoint short and tell the assistant which reference paths to read for the current task.
- Let maintainers add linked documents under an installed section folder without those documents being treated as ArcShape-managed files.
- Install and manage packaged nested resources with the existing provider, preview, offline, and file-preservation behavior.

**Non-Goals:**

- Change arc42's twelve-section structure or require generated documents to use every section.
- Automatically fetch or synchronize arc42 content at runtime.
- Create a new CLI command or a separate capability per arc42 section.

## Decisions

### Store guidance in one hierarchical resource tree

Use `capabilities/skills/arc-architecture/references/arc42/` as the packaged source. Add an index README that links to twelve numbered section folders, each with a main `README.md`. Put the section purpose, relevant subsections, useful evidence, gaps/conflicts handling, concise tips, and source links in that main file. Add separate subsection or topic documents only where focused material improves routing; link to them from the section README so maintainers can extend a section without editing the global skill entrypoint. The repository's `.agents/skills/arcshape-architecture/SKILL.md` should point to the same canonical material for work inside ArcShape.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

This gives every section a stable landing path while keeping genuinely large topics in smaller files. A flat set of files per section was considered, but it gives no natural extension boundary and makes a section's main entry less clear. A single large guide was rejected because it would make section-level loading coarse.

### Route by task through the skill entrypoint

Keep `SKILL.md` focused on the shared architecture workflow. Its description should make it discoverable for architecture documentation work; its instructions should map the requested or affected arc42 topics to section folders and tell the assistant to read only those `README.md` files and their relevant linked documents. For broad or cross-cutting tasks, it may select several sections; it must not load all section details by default. Preserve the existing evidence rules for observations, intent, inference, gaps, conflicts, and maintainer review.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DOCS" digest="sha256:a8d8da1da55a7368620ae2a1229bbc38cc0480e2267dc2916dea4bf6e0995a4c" -->
<!-- pdac:cite id="UC-MAINTAIN-ARCHITECTURE-DOCS" digest="sha256:0a93ce4931da4e6c21bfa56260f79aa86758991e202b0dc8b0f4e05761e5b120" -->
<!-- pdac:cite id="UC-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:3a956a71e74d729d9eaa0b4665e1a72c276f33bb458b51ed5737773f84099b24" -->

Explicit paths in the skill body are more portable than relying on provider-specific frontmatter for conditional file loading. Standard `name` and `description` frontmatter remains the discovery metadata; detailed content stays in linked files.

### Separate arc42-derived content attribution and licensing

Treat source-derived guidance as content, not as ArcShape software instructions. Include source-page links and available author attribution in each section's source list, plus a shared attribution and license notice for the guidance tree. Mark the arc42-derived material as CC BY-SA 4.0 and clearly scope that notice to the reference content; keep the rest of the ArcShape package's existing license notice distinct. Summarize tips and examples in ArcShape's own words, and retain links to original pages rather than copying whole examples.

The [arc42 documentation site](https://docs.arc42.org/) identifies its content as CC BY-SA 4.0, and the [license terms](https://creativecommons.org/licenses/by-sa/4.0/) require attribution and share-alike treatment for adaptations. A separate content notice makes those terms visible in the npm package without relabeling unrelated code. Before publication, verify the attribution and license shown by each specific source page used.

### Extend capability distribution to manage a resource tree

Have the installer enumerate regular files within each selected packaged capability and plan each destination path relative to that capability's skill directory. Keep the existing manifest shape and hash-per-file ownership model, but permit safe nested paths below the managed capability root. Continue rejecting path traversal and symlinks. Only packaged files enter the manifest; untracked user additions remain untouched by update and uninstall, while collisions and edited managed files remain visible conflicts or preserved actions.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->

Recursive copying is needed because references must be present in adopter repositories for assistants to read. Generating or downloading reference content after install was rejected because the package already ships canonical capabilities and install must work offline. A second registry or extension mechanism was rejected; linked Markdown files in the established capability directory are sufficient.

### Keep the manifest schema version

Continue using manifest version 1: the manifest still maps managed destination paths to file hashes, and existing single-file entries remain valid. Widen path validation to allow safe nested files only within known capability roots. Do not infer ownership from a file merely because its path or contents resemble a packaged reference.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## Risks / Trade-offs

- [Upstream arc42 pages or licenses change] → Link each guidance item to its source, record attribution and license, and review the listed source pages when updating the references.
- [A selected section's reference links to too much material] → Keep subsection documents optional and focused; review selection with representative single-section and cross-section tasks.
- [An adopter edits `SKILL.md` and does not receive the new routing instructions] → Preserve the edit as current lifecycle rules require, report it, and document the manual merge needed to use the new references.
- [Nested path validation allows a file outside the intended capability root] → Normalize relative paths, reject traversal and symbolic links, and cover both malformed manifests and symlinked destinations in lifecycle tests.
- [CC BY-SA guidance is confused with the package's software license] → Mark the reference subtree's content license and attribution explicitly; ensure package-level notices distinguish reference content from software.

## Migration Plan

On a confirmed capability update, install the updated `SKILL.md` and every packaged reference file for the selected providers. Existing manifests continue to identify the old `SKILL.md` by its hash; the update adds the new packaged paths and updates an unchanged skill file. If an installed file was edited or a destination conflicts, preserve it and report the action for maintainer review. Uninstall removes only unchanged files recorded in the manifest, leaving user-added extension documents in place. No manifest schema migration or runtime network access is required.
