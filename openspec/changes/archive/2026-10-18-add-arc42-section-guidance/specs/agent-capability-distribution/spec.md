# Spec Delta

<!-- pdac-scope: cited -->

## MODIFIED Requirements

### Requirement: Package provider-neutral ArcShape skills

ArcShape SHALL package portable Agent Skills and their supporting files with stable `arc-` names and standard `name` and `description` metadata. Provider adapters SHALL expose the same workflows and supporting resources without forking canonical instructions.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->

#### Scenario: Install canonical skills for Codex and shared-path providers
- **WHEN** a maintainer selects Codex, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, or GitHub Copilot
- **THEN** ArcShape installs selected skills and their packaged supporting files in a verified `.agents/skills/` location supported by that provider

#### Scenario: Install Claude Code adapter
- **WHEN** a maintainer selects Claude Code
- **THEN** ArcShape installs the selected skill workflows and their packaged supporting files through the verified `.claude/skills/` project or user location

### Requirement: Preserve user-owned files across lifecycle operations

The CLI SHALL track the package version and hashes of each packaged file it creates. Updates and removal SHALL affect only unchanged managed files. Edited, untracked, or conflicting files, including files added by maintainers under a skill's reference directories, SHALL be preserved and reported.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->

#### Scenario: Update an unchanged managed skill
- **WHEN** a tracked skill file still matches the hash ArcShape recorded at installation
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
