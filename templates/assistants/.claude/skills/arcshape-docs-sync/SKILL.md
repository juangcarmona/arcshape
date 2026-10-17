---
name: arcshape-docs-sync
description: Connect repository architecture Markdown to Obsidian or Confluence while keeping the repository copy reviewable and canonical. Use when a maintainer asks to link, export, or publish architecture documentation.
---

# ArcShape documentation connections

1. Confirm the source Markdown directory and the target vault or documentation space with the maintainer. Treat repository Markdown as canonical unless the maintainer explicitly describes another source of truth.
2. For an Obsidian vault, preview with `arcshape sync obsidian --vault <vault> --dry-run`, review target and file actions, then run without `--dry-run` when the maintainer has asked to sync. ArcShape updates only copies that still match its prior managed version; conflicts preserve vault edits for human reconciliation.
3. For Confluence Cloud, preview an existing blank or ArcShape-managed page with `arcshape sync confluence --base-url <url> --page-id <id> --dry-run`. Credentials must be supplied in environment variables; never put tokens in repository files or command arguments. The CLI stops when the remote page changed since the last sync. Remove `--dry-run` only when the maintainer has asked to publish that content.
4. Never copy credentials into repository files, include private content outside the requested scope, or silently overwrite an externally edited document.
5. Report which files/pages were linked, created, updated, unchanged, or conflicted. Keep canonical Markdown and external-system references traceable.
