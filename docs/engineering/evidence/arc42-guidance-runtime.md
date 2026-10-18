# Arc42 section guidance runtime evidence

Observed on 2026-10-18 with Node.js 22.22.1 from the current implementation tree.

## Drive command

    node bin/arcshape.mjs agents install --target <temporary-project> --providers codex,claude --yes

## Observation

The actual ArcShape CLI installed `arc-architecture` and the other bundled capabilities into a temporary project for both providers. The installed project contained a frontmatter-bearing Section 1 tip, a complete worked example, its referenced image, and the upstream license file. I opened the installed Markdown files and confirmed their source URL, source revision `3cb35782b62d0cd4103aedcc75fc4ba748f043ad`, attribution, and example-only warning were visible. The CLI reported success. It also emitted its expected note that Claude Code and shared-path providers may discover duplicate copies of the same skill; provider behavior varies.

The install selected 145 tip files, 35 example files, and 98 source images from the package. Selection remains per task: the skill directs assistants to read section indexes and only relevant topic files. This CLI workflow has no graphical screen to capture.

## Captured CLI output

    Plan: install arc-adr, arc-architecture, arc-c4, arc-docs-sync for codex, claude (project scope)
      create       .agents/skills/arc-architecture/references/arc42/01-introduction-and-goals/examples/example-overview-example-htmlsc-1.md
      create       .agents/skills/arc-architecture/references/arc42/01-introduction-and-goals/tips/tip-1-1-give-a-compact-summary-of-requirements-and-driving-forces.md
      create       .agents/skills/arc-architecture/references/arc42/09-architecture-decisions/README.md
    Completed install for 4 capability(s).

The CLI command exited with status 0. File existence and non-empty content were confirmed for the Codex tip, Claude example, Codex example image, and source license. The package smoke test also packed the package, installed its tarball offline into a temporary consumer project, and verified reference installation for both Codex and Claude.
