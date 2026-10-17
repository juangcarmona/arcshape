# /arcshape:sync

Connect this repository's architecture Markdown to the documentation system used by the project.

Use the `arcshape-docs-sync` skill. For Obsidian, preview and use `arcshape sync obsidian`; preserve local vault edits and report conflicts. For Confluence Cloud, preview with `arcshape sync confluence --base-url <url> --space-id <id> --parent-id <id> --title-prefix <project> --dry-run`; this creates an index and one page per arc42 section. Use `--page-id <id>` for a single-page destination. Publish only after the maintainer asks.
