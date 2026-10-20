# Design

## Context

See `proposal.md` for the motivation. ArcShape has one publishable workspace package, `@arcshape/cli`, uses npm workspaces, and currently keeps the Trusted Publisher configuration tied to `.github/workflows/publish.yml`. The current workflow is release-event driven and already contains the package, SBOM, license-policy, provenance, and registry verification steps that should remain part of the release boundary.

## Goals / Non-Goals

**Goals:**

- Make merged feature PRs accumulate release intent through Changesets.
- Maintain one generated `Version Packages` PR and make merging it the release decision.
- Keep publication CI-only, protected by `npm-publish`, and backed by the existing verification and supply-chain evidence.
- Preserve a public GitHub Release and `v<version>` tag as an automatically generated release record, while also creating the Changesets package tag used for package-level traceability.
- Provide an idempotent stable-publication recovery path.

**Non-Goals:**

- Alpha/beta prerelease trains.
- Publishing any package other than `@arcshape/cli`.
- Changes to ArcShape product behavior, product definition, or runtime architecture.

## Decisions

### Use Changesets for intent and versioning

Add `@changesets/cli`, `.changeset/config.json`, contributor guidance, and root `version`/`release` scripts. A feature PR adds a changeset when it changes the published package. The generated version PR consumes pending changesets, updates `packages/cli/package.json`, package changelog output, and the lockfile. A process-only change such as this one does not add a pending package changeset.

Alternative rejected: manually editing `packages/cli/package.json` in each release branch. It cannot aggregate multiple merged PRs or review release notes before the version is committed.

### Keep `publish.yml` as the workflow identity

Convert `.github/workflows/publish.yml` from a `release.published` trigger to `push` on `main` plus an explicit stable recovery dispatch. Keeping the filename preserves the existing npm Trusted Publisher identity; the documentation will state that the environment and trusted publisher refer to this workflow.

Alternative rejected: introducing `release.yml` without a configuration migration. npm Trusted Publishing identifies the workflow filename, so a rename would add an avoidable external configuration gate.

### Separate version-PR maintenance from publication

The workflow has two stable paths:

1. `version-pr` runs on every `main` push with `contents: write` and `pull-requests: write`, runs `npm run version`, and uses `changesets/action` to create or update one `Version Packages` PR. It never publishes and never pushes protected `main` directly.
2. `publish-stable` runs only for a merged `Version Packages` commit or the explicit `publish-current-stable` recovery dispatch. It runs the deterministic release checks in the protected `npm-publish` environment, publishes the package with npm provenance, and verifies the registry.

Alternative rejected: making the version action publish directly. The reviewed version PR must be merged before npm is mutated, so repository state is authoritative first.

### Preserve both package and human-facing release records

After successful or already-complete npm publication, the release job ensures the Changesets package tag `@arcshape/cli@<version>` exists remotely and creates or updates the human-facing GitHub Release `v<version>` on the exact main commit. The verified SBOM is uploaded to that GitHub Release. The old release-event publisher is removed so creating the GitHub Release cannot trigger a second npm publication.

Alternative rejected: dropping GitHub Releases entirely. ProductShape does not require them, but ArcShape already documents and exposes them as the maintainer-facing release record and SBOM attachment surface; automatic creation retains that useful evidence without retaining the manual release decision.

### Make publication recovery state-aware

Add a small release-state helper that reads the package manifest and compares the committed version with npm. It reports `pending`, `already-published`, or an inconsistent state. It refuses to publish when npm contains a newer version, skips immutable versions already present, and lets the recovery path repair missing tags or release assets. The helper is unit-tested with deterministic state fixtures; network reads remain confined to the workflow.

## Risks / Trade-offs

- [Risk] The GitHub Actions token cannot create or update the version PR. → Document and test the required repository setting, and fail visibly in the version job.
- [Risk] npm Trusted Publishing still points at the old release-event assumptions. → Keep the `publish.yml` filename and document the required repository/environment/workflow values; verify the external configuration as runtime evidence rather than claiming it locally.
- [Risk] npm publication succeeds but tag or GitHub Release creation fails. → Publish once, treat npm as immutable, make tag/release creation idempotent, and expose `publish-current-stable` recovery that skips an existing npm version and repairs repository evidence.
- [Risk] A malformed or stale changeset produces an unintended bump. → Validate Changesets in CI, review the generated `Version Packages` PR, and keep the merge of that PR as the human release gate.
- [Risk] Existing release scripts become misleading after the trigger change. → Remove or adapt event-specific helpers and update `docs/releasing.md`, `docs/engineering-lifecycle.md`, and workflow contract tests in the same change.

## Migration Plan

1. Add Changesets configuration and scripts without adding a pending package release intent.
2. Replace the release-event workflow with version-PR maintenance, protected stable publication, automatic tags/release creation, and recovery dispatch.
3. Add deterministic workflow and release-state tests, then update release and lifecycle documentation.
4. Merge the implementation PR. The first normal release after adoption is generated from changesets added by later feature PRs; no synthetic package bump is created by this migration.
5. Configure or verify the existing `npm-publish` environment and Trusted Publisher against the final workflow, then exercise the first generated Version Packages flow with maintainer approval.

Rollback is a repository revert before the next release. If a publication has already reached npm, do not overwrite or force-move the immutable version; use the documented publish-forward/recovery procedure.

<!-- pdac-scope: none reason="This design covers release automation and delivery controls, not product behavior or product intent." -->
