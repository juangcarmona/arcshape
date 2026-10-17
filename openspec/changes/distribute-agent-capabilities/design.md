# Design

<!-- pdac-scope: cited -->

## Context

See `proposal.md` for motivation and `specs/agent-capability-distribution/spec.md` for externally observable behavior. Today `bin/init.mjs` collects every file under `templates/assistants`, copies them beside architecture templates, and writes each file independently. `package.json` publishes the whole `templates/` directory. There is no provider registry, install ownership manifest, or update/removal path.

## Goals / Non-Goals

**Goals:** Keep canonical workflows provider-neutral, distribute them in the npm tarball, adapt discovery paths for seven named providers, and make setup/update/removal deterministic and edit-safe.

**Non-Goals:** Agent runtime detection by launching applications, marketplace publishing, executing skill resources, syncing skills to hosted accounts, semantic merges of user edits, and support claims for provider-specific features beyond documented skill discovery.

## Decisions

### Keep capability sources separate from CLI templates

Move the maintained shared skill sources to `capabilities/skills/<arc-name>/SKILL.md`, with optional `references/` and `assets/`. Put provider discovery metadata in `capabilities/providers.json`. Keep architecture-document templates under `templates/architecture/`; do not put agent-facing skills under the CLI's template subtree. Include both directories in the npm `files` list, excluding development-only sources.

The four canonical names are `arc-adr`, `arc-architecture`, `arc-c4`, and `arc-docs-sync`. Reuse current workflow content, change provider-specific wording to neutral language where necessary, and remove obsolete `arcshape-*` naming from generated skill metadata. Keep only provider-specific additions in adapters; do not fork workflow bodies.

<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->

### Use verified shared discovery with a Claude Code adapter

The provider registry records each provider ID, display name, detection signals, project and user skills roots, and source URL last checked. Initial roots are:

| Provider         | Project skills root | User skills root    | Installation notes                                                                                                                               |
| ---------------- | ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Codex            | `.agents/skills/`   | `~/.agents/skills/` | Native Agent Skills discovery.                                                                                                                   |
| Claude Code      | `.claude/skills/`   | `~/.claude/skills/` | Provider-specific location; install the same canonical skill content.                                                                            |
| Cursor           | `.agents/skills/`   | `~/.agents/skills/` | Documented shared path; do not emit duplicate `.cursor/skills/` copies.                                                                          |
| Windsurf/Cascade | `.agents/skills/`   | `~/.agents/skills/` | Current Cascade docs also name `.devin/skills/`; use documented cross-agent discovery and label the target Windsurf surface for re-verification. |
| Gemini CLI       | `.agents/skills/`   | `~/.agents/skills/` | Documented shared path.                                                                                                                          |
| OpenCode         | `.agents/skills/`   | `~/.agents/skills/` | Documented shared path.                                                                                                                          |
| GitHub Copilot   | `.agents/skills/`   | `~/.agents/skills/` | Use skills discovery, not Copilot plugin or marketplace installation.                                                                            |

Install one copy in `.agents/skills/` for selected providers that support it and a copy in `.claude/skills/` when Claude Code is selected. When a selected client scans both locations, the plan reports the duplicate discovery possibility; it does not invent provider-specific de-duplication behavior. Project scope is the default. User scope is explicit and uses `homedir()`; it is never inferred from project selection.

The provider rows are grounded in current official documentation: [Codex](https://developers.openai.com/codex/skills), [Claude Code](https://code.claude.com/docs/en/skills), [Cursor](https://cursor.com/docs/skills), [Windsurf Cascade](https://docs.windsurf.com/windsurf/cascade/skills), [Gemini CLI](https://geminicli.com/docs/cli/using-agent-skills/), [OpenCode](https://docs.opencode.ai/docs/skills/), and [GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills). Windsurf's URL currently redirects to Devin Desktop Cascade documentation; release notes must preserve that limitation.

<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->

### Separate detection, planning, confirmation, and mutation

Add deterministic modules under `bin/agents/` for provider metadata, local detection, planning, and managed-file lifecycle. Detection reads `PATH` and known project markers only; it does not execute binaries, read credentials, or use the network. Provider markers are classified as strong or weak, and each detection includes its evidence. Generic `.agents/skills/` presence is not provider-specific evidence.

`arcshape init` first gathers architecture and capability file actions into one plan. It presents detected providers as suggestions, permits explicit provider/capability selection, and supports `--no-agents` for CLI-only setup. Non-interactive use requires `--providers <ids>` or `--no-agents`, then `--yes` to write; `--dry-run` never writes. Add `arcshape agents detect|list|install|update|uninstall` for capability lifecycle outside initialization. All commands share the same plan and confirmation code.

No new runtime dependency is required. Interactive prompts use Node's `node:readline/promises`; other provider and skill data are package-owned JSON and Markdown.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="UC-ONBOARD-REPOSITORY" digest="sha256:ac5e91032100634e83b8d426343000decfc67811e30c00f6a9838e67305dce01" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

### Track ownership with a versioned manifest and hashes

Store project-scope ownership in `.arcshape/agent-capabilities.json`; store user-scope ownership in `~/.arcshape/agent-capabilities.json`. The manifest schema records its schema version, npm package version, scope, selected providers/capabilities, destination paths, and installed SHA-256 for each ArcShape-created file. Use relative paths for project destinations and normalized absolute paths for user destinations.

Before any write, preflight every source and destination, verify containment, reject symlinks in destination components, and load/validate the manifest. Existing untracked destinations are conflicts and are never adopted. For update, replace only a tracked file whose current hash equals its manifest hash. For removal, delete only tracked files whose current hash still matches. Preserve edited files and report paths; do not attempt a merge. Write files atomically where supported, then write the manifest last. If manifest contents are invalid or destination roots are unsafe, abort the operation without changing files.

Retain a versioned list of hashes for the exact ArcShape 0.1.1 legacy assistant files. During a confirmed provider install/update/uninstall, offer unchanged legacy files for removal and preserve any file whose hash differs. CLI-only init does not migrate or remove legacy agent files. This avoids leaving two visible generations after a normal upgrade without treating user edits as ArcShape-owned.

<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->

### Keep package version authoritative

Read the package version from the installed `package.json` at runtime and store it with the managed-file manifest. Do not add a separate version field that can drift. Include the capability package and adapters in the tarball so all reads and writes work after `npm pack` installation with network disabled.

<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

### Migrate legacy templates without deleting edited content

Record SHA-256 values for all shipped 0.1.1 files under `.agents/skills/arcshape-*`, `.claude/skills/arcshape-*`, and `.claude/commands/arcshape/`. The installer can recognize an exact legacy file and include its removal in the same reviewed plan as installation of `arc-*` skills. A modified legacy file is retained and reported. Do not write old names again after migration.

<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->

## Risks / Trade-offs

- [Provider discovery behavior changes] → Keep roots and evidence URLs in the provider registry; validate paths against official docs and retest before each compatibility claim.
- [Clients can scan both `.agents/skills` and `.claude/skills`, exposing duplicate names] → Report overlap in the plan and document it; do not silently change skill names or assert client-specific de-duplication.
- [A project or user manifest is edited or malformed] → Abort managed mutation and provide a repair path; never discard the manifest or infer ownership from filenames.
- [A local writer changes a file after preflight] → Recheck symlink and content state immediately before each mutation, create files exclusively, and stop on a race rather than overwrite.
- [The npm `files` allowlist omits capability assets] → Add an offline package smoke test that inspects the packed tarball and installs from it with network disabled.
- [Old project skills were edited before ArcShape tracked ownership] → Migrate only files matching exact 0.1.1 hashes after preview and confirmation; preserve all other legacy content.

## Migration Plan

1. Add canonical capability sources and provider registry to the package; replace `arcshape-*` names with `arc-*` in new installs.
2. Teach `arcshape init` and `arcshape agents` to preview and install/manage capabilities from the package. Preserve architecture-file behavior and add a CLI-only flag.
3. On confirmed capability install/update, migrate only exact-hash 0.1.1 assistant files. Preserve edited legacy files and list them in the result.
4. Publish a versioned package only after package-smoke tests prove the tarball contains capabilities and installs offline. Update README with provider paths, selection flags, conflict behavior, and migration notes.
5. Rollback by installing the prior npm package version. Do not delete current or user-edited files during rollback; any removal remains explicit through `arcshape agents uninstall`.

## Open Questions

None. Provider-specific command or plugin adapters beyond Agent Skills remain out of scope unless official discovery documentation shows a provider cannot expose these workflows through the verified skill path.
