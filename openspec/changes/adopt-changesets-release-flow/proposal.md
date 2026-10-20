# Proposal

## Why

ArcShape currently starts its release workflow only after a maintainer manually changes the package version, creates a `v<version>` tag, and publishes a GitHub Release. That prevents merged feature pull requests from contributing reviewable release intent and leaves the release decision disconnected from the set of changes that are ready to ship.

ProductShape solves this with Changesets: feature pull requests commit release-intent files, merged intents accumulate on `main`, and one generated `Version Packages` pull request collects the next release. ArcShape should adopt that stable flow while retaining its existing package verification, SBOM, license policy, provenance, trusted publishing, and protected-environment controls.

## What Changes

- Add Changesets configuration for the single public workspace package `@arcshape/cli`.
- Define the contributor contract for adding a patch, minor, or major changeset to a feature pull request.
- Add a `Version Packages` workflow that creates or updates one release pull request from pending changesets after they reach `main`.
- Replace the current manual version/tag/GitHub Release handoff with a protected CI publication triggered by the merged version commit.
- Preserve the existing deterministic checks, packed-package/SBOM verification, npm provenance, registry verification, and safe recovery behavior.
- Add workflow-contract tests and document the required GitHub Actions, environment, npm Trusted Publisher, tag, and recovery configuration.
- Keep pre-release trains and unrelated product behavior out of this stable-flow adoption.

## Capabilities

### New Capabilities

None. This is repository release tooling and documentation; it does not introduce a user-facing product capability.

### Modified Capabilities

None. Existing OpenSpec capabilities describe ArcShape product behavior and are not changed by this work.

## Impact

- Repository root `package.json`, lockfile, and the published CLI manifest.
- New `.changeset/` release-intent configuration and contributor documentation.
- GitHub Actions release workflow and its deterministic contract tests.
- Existing npm publication workflow and release documentation, including the final tag/GitHub Release representation.
- GitHub Actions pull-request permissions, protected `npm-publish` environment, and npm Trusted Publisher configuration.

The complete ProductShape product model under `docs/product/model` was reviewed. This change does not touch or alter any product artifact, architecture decision, or product behavior, so no ProductShape citation or Product Change is applicable and no product-definition drift is present.

<!-- pdac-scope: none reason="This change modifies repository release tooling and delivery documentation, not ArcShape product behavior or product intent." -->
