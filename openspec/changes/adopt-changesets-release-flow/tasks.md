# Tasks

## 1. Changesets foundation

- [x] 1.1 Add the Changesets CLI, npm scripts for `version` and `release`, and the lockfile update; verify `npm ci`, `npm exec -- changeset --version`, and a no-pending-changeset version run complete without a package version diff.
- [x] 1.2 Add `.changeset/config.json` and contributor guidance describing patch/minor/major release intent for `@arcshape/cli`; verify the configuration names `main`, public access, and the published workspace package without adding a pending release intent for this process-only change.

## 2. Release-state and recovery implementation

- [x] 2.1 Implement the release-state helper that compares the committed package version with npm and distinguishes pending, already-published, and npm-ahead/inconsistent states; verify deterministic unit cases cover each state and malformed registry responses.
- [x] 2.2 Implement idempotent tag and GitHub Release/SBOM handling for the stable publication path, reusing the existing package identity and provenance verification; verify rerun logic skips an immutable npm version and repairs missing repository evidence.

## 3. GitHub Actions release flow

- [x] 3.1 Convert `.github/workflows/publish.yml` to maintain one `Version Packages` PR on `main` pushes with `changesets/action`, required PR permissions, and no direct protected-main write; verify a workflow contract test covers pending and empty changeset cases and the single-PR contract.
- [x] 3.2 Add the protected stable publication and `publish-current-stable` recovery paths after a merged Version Packages commit; verify the workflow contract requires the existing format, lint, typecheck, tests, build, security/license, SBOM, provenance, registry, and tag/release checks before completion.
- [x] 3.3 Remove or adapt release-event-only scripts and stale workflow assumptions; verify no workflow can publish twice from the same generated GitHub Release and the final workflow retains least-privilege permissions and the `npm-publish` environment.

## 4. Documentation and lifecycle contract

- [x] 4.1 Update `docs/releasing.md` and the relevant engineering lifecycle release references to describe feature changesets, accumulated merged intents, the Version Packages decision, publication, external configuration, and recovery; verify every documented command and workflow filename matches the implementation.
- [x] 4.2 Add or update deterministic release workflow tests and package smoke coverage for the generated version/changelog/tag contract; verify `npm test` exercises the new cases and no synthetic package release intent remains in the repository.

## 5. Integration verification

- [x] 5.1 Run the repository CI-equivalent deterministic lane, OpenSpec validation, ProductShape model/citation checks, and release workflow contract checks; verify all results are captured under the FF evidence directory and current-head evidence supports the issue acceptance criteria.
- [x] 5.2 Re-read the final diff against this plan, record the required external GitHub/npm configuration as observed or unverified, and verify the release branch is ready for the independent Done-gate audit.

## Workflow follow-up

- Archive the OpenSpec change after implementation and integration requirements are satisfied.
- Configure or confirm the `npm-publish` environment and npm Trusted Publisher outside the repository, then exercise the first real Version Packages release with maintainer approval.

<!-- pdac-scope: none reason="These tasks implement release tooling and delivery documentation, not product behavior or product intent." -->
