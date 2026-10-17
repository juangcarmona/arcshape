# Tasks

<!-- pdac-scope: cited -->

## 1. Canonical capability package

- [x] 1.1 Move the four maintained workflows into `capabilities/skills/arc-{adr,architecture,c4,docs-sync}/SKILL.md`, normalize their portable metadata and instructions, and verify each skill's frontmatter, name, and resource links with focused tests.
- [x] 1.2 Add the provider registry with verified project/user roots and evidence links for all seven providers; verify registry schema, unique provider IDs, and shared-path grouping with unit tests.
- [x] 1.3 Include the canonical capabilities in the npm package and remove shipped assistant templates from active init inputs; verify a packed tarball contains all sources and installed CLI capability operations need no external service.

<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->

## 2. Deterministic detection and install planning

- [x] 2.1 Implement provider detection from PATH and documented local markers without executing binaries or using the network; verify positive, absent, weak, and ambiguous evidence with unit tests.
- [x] 2.2 Implement capability selection and project/user destination planning, including overlap reporting for clients that scan both shared and Claude roots; verify provider combinations and scope paths with table-driven tests.
- [x] 2.3 Implement manifest validation, SHA-256 ownership tracking, path containment, symlink rejection, exclusive creation, safe update/removal, and atomic manifest-last writes; verify conflict, edit-preservation, malformed-manifest, and path-race cases with filesystem tests.

<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## 3. CLI lifecycle and migration

- [x] 3.1 Add `arcshape agents detect|list|install|update|uninstall` with shared preview and confirmation behavior; verify each command's dry-run, interactive, and explicit non-interactive paths through CLI tests.
- [x] 3.2 Update `arcshape init` to combine architecture and optional agent changes in one preview, support `--no-agents`, explicit provider/capability/scope selection, and require explicit non-interactive choices; verify no files are written when selection or confirmation is missing.
- [x] 3.3 Add exact-hash migration for unchanged ArcShape 0.1.1 assistant files and preserve/report modified files; verify legacy cleanup is offered only during confirmed agent lifecycle operations and never during CLI-only init.
- [x] 3.4 Remove the closed-PR #48 grandfathered branch-name exception and verify current issue-linked branch conventions pass while `codex/...` names fail.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="UC-ONBOARD-REPOSITORY" digest="sha256:ac5e91032100634e83b8d426343000decfc67811e30c00f6a9838e67305dce01" -->

## 4. Documentation and integration evidence

- [x] 4.1 Update README, engineering lifecycle, and CLI help with provider coverage, discovery limits, flags, project default, user scope, conflict behavior, offline operation, migration, and uninstall; verify every documented command and option against CLI help.
- [x] 4.2 Refresh ProductShape citations in all changed OpenSpec documents and verify `npm exec -- prodshape citations verify --provider openspec` reports every current document classified with current citations.
- [x] 4.3 Run the complete repository CI-equivalent checks, strict OpenSpec validation, ProductShape validation, npm package smoke tests, and security audit; record exact results and address every failure before review.
  - Evidence: [PR #52](https://github.com/juangcarmona/arcshape/pull/52), head `4bc459b18dcf0ea9d365cf2dadc2534b567aec6b`; all six Node 22/24 × Ubuntu/Windows/macOS jobs, Product model, Repository conventions, Secrets scan, Dependency audit, and reader site build passed. Local checks also passed: 77 tests, format, lint, typecheck, build, strict OpenSpec validation, 35 ProductShape artifacts with zero diagnostics, and 45 current citations across four OpenSpec documents.

<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
