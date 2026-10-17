# Refinement record

## Scope and evidence

This change refines the accepted package-v1 product baseline for the distribution and lifecycle of agent capabilities. It does not reopen the already-applied package-v1 capability set.

Evidence reviewed:

- The accepted baseline currently limits AI workflows to Codex and Claude and treats the CLI and AI workflows as separate interfaces.
- `bin/init.mjs` currently collects every assistant template and copies it together with architecture templates; it has no provider-selection or scope-selection flow.
- `package.json` publishes `templates/` with the npm package, so offline delivery of bundled capabilities is already a viable product direction.
- Official Agent Skills documentation defines a portable directory format centered on `SKILL.md`, optional `scripts/`, `references/`, and `assets/`, and required `name`/`description` metadata ([specification](https://agentskills.io/specification)). Provider-specific commands, rules, plugins, permissions, and discovery behavior remain distinct.
- Official provider documentation verifies support in [Codex](https://developers.openai.com/codex/skills), [Claude Code](https://code.claude.com/docs/en/skills), [Cursor](https://cursor.com/docs/skills), [Windsurf Cascade](https://docs.windsurf.com/windsurf/cascade/skills), [Gemini CLI](https://geminicli.com/docs/cli/using-agent-skills/), [OpenCode](https://docs.opencode.ai/docs/skills/), and [GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills). Cursor, Copilot, Gemini CLI, OpenCode, and current Cascade documentation describe `.agents/skills/` discovery; other provider paths and behavior differ. GitHub Copilot was added to the initial provider set because the maintainer asked for all major agents and its official docs now confirm support across several coding-agent surfaces.
- Official documentation confirms Agent Skills support for Codex, Claude Code, Cursor, Windsurf Cascade/Devin Desktop, Gemini CLI, OpenCode, and GitHub Copilot. Cursor, Copilot, Gemini CLI, OpenCode, and current Cascade documentation describe `.agents/skills/` discovery; other provider paths and behavior differ. GitHub Copilot was added to the initial provider set because the maintainer asked for all major agents and its official docs now confirm support across several coding-agent surfaces.
- The current Windsurf documentation route redirects to Devin Desktop's Cascade documentation. That documentation names `.devin/skills/` as preferred and `.windsurf/skills/` as a legacy-compatible location, while also documenting discovery of `.agents/skills/`. ArcShape should verify and label this adapter against the product surface actually targeted at release time.
- Existing instructions are already duplicated under `.agents/skills/` and `.claude/skills/`; generated or copied artifacts therefore need clear ownership and edit-preservation behavior.
- GitHub issue [#47](https://github.com/juangcarmona/arcshape/issues/47) tracks this change and its later implementation. Existing umbrella issue [#25](https://github.com/juangcarmona/arcshape/issues/25) covers package v1 and excludes providers beyond Codex and Claude.

## Graph-guided integrity pass

| Changed/proposed node | Neighbour and relationship | Classification | Reason |
| --- | --- | --- | --- |
| `UC-ONBOARD-REPOSITORY` | `FR-ONBOARD-REPOSITORY` (`derived-from`), `TERM-ARCHITECTURE-DOCUMENTATION` (`uses-terms`) | Affected | Onboarding now selects and installs agent capabilities as a distinct step. |
| `UC-MANAGE-AGENT-CAPABILITIES` | `FR-AGENT-CAPABILITY-DISTRIBUTION` (`derived-from`) | Added | Provider detection, selection, preview, install, update, and removal need an explicit maintainer-facing outcome. |
| `FR-ONBOARD-REPOSITORY` | `UC-ONBOARD-REPOSITORY` (`derived-from`) | Affected | The product must describe selection, opt-in installation, offline package assets, and edit-safe lifecycle behavior. |
| `FR-ASSISTED-WORKFLOWS` | Architecture, reverse-engineering, ADR, and C4 use cases (`derived-from`) | Affected | Existing workflows need a provider-neutral core and verified provider adapters. |
| `FR-CLI-COMMANDS` | Onboarding and architecture use cases (`derived-from`) | Affected | The CLI remains the deterministic installer and lifecycle interface; agent reasoning stays outside it. |
| `ACT-AI-ASSISTANT` | `FR-ASSISTED-WORKFLOWS` as a supporting actor | Affected | Its boundary currently says the first supported environments remain undecided, which is no longer true. |
| `FR-ARC42-DOCUMENTATION`, `FR-READER-VIEW`, architecture terms, and existing business rules | Adjacent product nodes | Checked and unaffected | Provider distribution does not change canonical Markdown, arc42 content, reader generation, or product authority. |

## Recorded decisions

- “metamos a todos los grandes” — include major agents in the initial provider scope, with compatibility claims grounded in verification. GitHub Copilot is included based on official current support evidence.
- “Versiones de skills y comandos van con el paquete.” — ship capability and adapter versions with the npm package version.
- “arc-* está bien pero creo que arc-* es mejor.” — use the `arc-` prefix for ArcShape-owned capabilities.
- “OK” to marketplaces remaining optional; no marketplace is required for installation.
- The maintainer wants provider detection and a choice when detection is inconclusive, plus a documented flag for non-interactive use.
- Detection may guide the suggested choice but does not itself authorize writing files; show the plan and require confirmation before installation.
- Preserve files edited by the user during update and removal; installation must not run capability scripts or grant permissions silently.

## Recommendation and parked question

The maintainer accepted the recommended default: “OK estoy dre acuerdo con tu propuesta de instalar en el repo por defecto....” Accordingly, project-scoped installation is the default where supported; user-scoped installation remains available by explicit selection. Provider adapters must report when project scope is unavailable rather than silently switching to user scope.

## Readiness

The product boundary, provider set, package versioning, offline expectation, opt-in selection, project-scope default, preservation rules, and marketplace position are drafted. No material product question remains in this refinement pass. This draft is ready for maintainer review; it is not approved, applied, or archived.
