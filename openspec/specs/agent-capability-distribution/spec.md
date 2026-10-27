# agent-capability-distribution Specification

<!-- pdac-scope: cited -->

## Purpose

Lets repository maintainers install and manage versioned ArcShape agent capabilities through provider-specific discovery adapters, independently from the deterministic CLI and without overwriting user-owned files.

## Requirements

### Requirement: Package provider-neutral ArcShape skills

ArcShape SHALL package portable Agent Skills and supporting files with stable names and standard skill metadata. Provider adapters SHALL expose the same skills and files without forking workflows.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:a1b8909b36e850b9ac1a2e5639f89749b039875f2fbe9c648167ed174edb8a89" -->

#### Scenario: Install canonical skills for Codex and shared-path providers

- **WHEN** a maintainer selects Codex, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, or GitHub Copilot
- **THEN** ArcShape installs selected skills and packaged resources in a verified `.agents/skills/` location

#### Scenario: Install Claude Code adapter

- **WHEN** a maintainer selects Claude Code
- **THEN** ArcShape installs selected skill workflows and packaged resources through the verified `.claude/skills/` location

### Requirement: Detect providers from local evidence

The CLI SHALL detect providers from local executable and repository-configuration signals. It SHALL report evidence, keep detection separate from selection, and SHALL NOT contact a service or launch an agent during detection.
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

#### Scenario: Report positive detection evidence

- **WHEN** a provider executable or recognized provider configuration is present
- **THEN** the CLI reports that provider and the local signal that matched

#### Scenario: Do not infer a provider from an ambiguous signal

- **WHEN** a local signal may apply to multiple providers or cannot identify a provider reliably
- **THEN** the CLI reports it as ambiguous and asks the maintainer to choose rather than silently selecting it

### Requirement: Keep deterministic onboarding independent

`init` SHALL offer CLI-only or provider/capability selection; non-interactive use SHALL require a choice.
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->
<!-- pdac:cite id="UC-ONBOARD-REPOSITORY" digest="sha256:ac5e91032100634e83b8d426343000decfc67811e30c00f6a9838e67305dce01" -->

#### Scenario: Initialize deterministic CLI only

- **WHEN** a maintainer selects the CLI-only option
- **THEN** `arcshape init` installs architecture documentation files and does not write agent capability files

#### Scenario: Require explicit choices in non-interactive mode

- **WHEN** standard input is not interactive and no provider selection or CLI-only option is supplied
- **THEN** `arcshape init` exits with guidance and does not write any files

### Requirement: Preview and confirm all planned file changes

Before installation, update, or removal, the CLI SHALL preview providers, scope, file actions, and conflicts. It SHALL write only after explicit confirmation, and declining SHALL leave the target unchanged.
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->

#### Scenario: Preview without writing

- **WHEN** a maintainer requests a dry run
- **THEN** the CLI lists planned file actions and conflicts without creating, changing, or removing files

#### Scenario: Decline a displayed plan

- **WHEN** the maintainer declines the installation or update confirmation
- **THEN** the CLI leaves all planned destinations unchanged

### Requirement: Preserve user-owned files across lifecycle operations

The CLI SHALL record package version and per-file hashes. Updates and removal SHALL change only unchanged managed files; edited or untracked files, including maintainer-added reference documents, SHALL be preserved and reported.
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->

#### Scenario: Update an unchanged managed skill

- **WHEN** a tracked file still matches the hash ArcShape recorded at installation
- **THEN** an approved update replaces it with the package's current version and refreshes its managed hash

#### Scenario: Preserve an edited skill on update or removal

- **WHEN** a tracked file differs from its recorded installed hash
- **THEN** ArcShape leaves it unchanged and reports the path and required manual action

#### Scenario: Preserve an existing untracked file

- **WHEN** a destination already exists without ArcShape ownership metadata
- **THEN** ArcShape does not overwrite or claim ownership of that file, even if its contents match a packaged skill

#### Scenario: Preserve maintainer-added reference material

- **WHEN** a maintainer adds a document under an installed skill's reference directory and later updates or removes the packaged capability
- **THEN** ArcShape leaves the untracked document unchanged and does not claim ownership of it

#### Scenario: Add another provider to an existing installation

- **WHEN** a maintainer installs an additional provider or capability for the same scope
- **THEN** ArcShape retains previously managed providers and capabilities unless the maintainer explicitly uninstalls them

### Requirement: Install from the package without external services

Agent capabilities and their supporting resources SHALL ship in the npm package at the CLI version. Their lifecycle SHALL work offline, without marketplaces, and SHALL NOT execute packaged scripts.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->

#### Scenario: Install from an offline npm package

- **WHEN** ArcShape is installed locally and the maintainer runs the confirmed install flow without network access
- **THEN** all selected packaged resources are sourced from the installed package and installation succeeds

#### Scenario: Do not run capability scripts

- **WHEN** ArcShape plans or performs a capability installation
- **THEN** it copies validated package files only and does not execute files bundled with a capability
