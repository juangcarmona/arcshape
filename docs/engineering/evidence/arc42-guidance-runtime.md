# Arc42 section guidance runtime evidence

Observed on 2026-10-18 with Node.js 22.22.1 from the corrected implementation tree.

## Drive command

    node bin/arcshape.mjs agents install --target <temporary-project> --providers codex,claude --yes

## Observation

The CLI installed `arc-architecture` and the other selected capabilities into a temporary project for Codex and Claude. It installed the section hierarchy and complete Markdown tip/example references, with image links remaining at `https://docs.arc42.org/assets/images/...`. No image binaries were installed. The packaged ADR template was installed under both `.agents/skills/arc-adr/references/template.md` and `.claude/skills/arc-adr/references/template.md`.

The Codex arc42 tree contained 194 Markdown files: the index, source register, 12 section READMEs, 145 tips, and 35 examples. With both providers selected, the CLI creates provider-specific copies. The npm package itself contains 242 files, 629,308 unpacked bytes and 160,625 packed bytes; its packed-file smoke test enforces ceilings of 300 files and 800,000 unpacked bytes and rejects image files in the reference tree. This keeps the text guidance independently selectable without shipping the 98 upstream image binaries.

The CLI exited with status 0. File existence and content were confirmed for both ADR templates, one Codex section tip, and one Claude example. The example retained its absolute upstream image URL. A filesystem scan found zero files below either installed `arc42/assets/images` path. The CLI emitted its expected note that Claude Code and shared-path providers may discover duplicate copies of the same skill; provider behavior varies.

This CLI workflow has no graphical screen to capture.
