# Arc42 section guidance runtime evidence

Observed on 2026-10-18 from the current source tree with Node.js 22.22.1.

## Drive command

    node bin/arcshape.mjs agents install --target <temporary-project> --providers codex --capabilities arc-architecture --yes

## Observation

The real ArcShape CLI installed the arc-architecture capability into a temporary project and reported success. The installed Section 10 reference existed at .agents/skills/arc-architecture/references/arc42/10-quality-requirements/README.md and began with # 10. Quality Requirements. The command exited successfully; stderr was empty. This CLI workflow is the runtime surface for this change; there is no graphical application screen for the section guidance. The temporary project was removed after inspection.

## Captured CLI output

    Plan: install arc-architecture for codex (project scope)
      create       .agents/skills/arc-architecture/references/arc42/01-introduction-and-goals/README.md
      create       .agents/skills/arc-architecture/references/arc42/02-constraints/README.md
      create       .agents/skills/arc-architecture/references/arc42/03-context-and-scope/README.md
      create       .agents/skills/arc-architecture/references/arc42/04-solution-strategy/README.md
      create       .agents/skills/arc-architecture/references/arc42/05-building-block-view/README.md
      create       .agents/skills/arc-architecture/references/arc42/06-runtime-view/README.md
      create       .agents/skills/arc-architecture/references/arc42/07-deployment-view/README.md
      create       .agents/skills/arc-architecture/references/arc42/08-crosscutting-concepts/README.md
      create       .agents/skills/arc-architecture/references/arc42/09-architecture-decisions/README.md
      create       .agents/skills/arc-architecture/references/arc42/10-quality-requirements/README.md
      create       .agents/skills/arc-architecture/references/arc42/11-risks-and-technical-debt/README.md
      create       .agents/skills/arc-architecture/references/arc42/12-glossary/README.md
      create       .agents/skills/arc-architecture/references/arc42/README.md
      create       .agents/skills/arc-architecture/references/arc42/SOURCES.md
      create       .agents/skills/arc-architecture/SKILL.md
    Completed install for 1 capability(s).
