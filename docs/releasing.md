# Releasing ArcShape

ArcShape uses Changesets to separate feature delivery from the stable package
release decision. The published package is `@arcshape/cli`; its executable
remains `arcshape`.

## Normal stable release

1. A pull request that changes the published package runs
   `npm exec -- changeset` and commits the generated file under `.changeset/`.
   Documentation or process-only changes do not need a changeset.
2. After the pull request merges to `main`, the `version-pr` job in
   `.github/workflows/publish.yml` creates or updates one `Version Packages`
   pull request. That pull request runs `npm run version`, which updates the
   package version, changelog, and lockfile and consumes the pending changesets.
3. A maintainer reviews and merges `Version Packages`. Merging that reviewed
   commit is the release decision; feature pull requests do not publish
   directly.
4. The workflow resolves the release mode first. The `publish-stable` job only
   accepts a stable-mode commit whose subject starts with `Version Packages`
   or `chore: Version Packages`; mentioning those words in an ordinary merge
   body is not sufficient. It runs from the merged commit in the protected
   `npm-publish` environment. It runs the formatting, lint, typecheck, test,
   build, dependency-audit, SBOM, and license-policy checks, then publishes
   `@arcshape/cli` through npm Trusted Publishing with provenance.
5. The job verifies the registry version, creates or reuses the immutable
   package tag `@arcshape/cli@<version>`, creates or reuses GitHub Release
   `v<version>`, verifies that release against `main`, and attaches the
   version-matched SBOM. GitHub Release creation is an evidence step in this
   workflow; it does not trigger another publisher.

Only the protected CI job publishes the package. Do not manually bump the
package version, create release tags, or publish from a developer workstation
for a normal release.

## First publication and required configuration

The one-time first publication of an unclaimed package name is a maintainer
setup task. Confirm the npm scope, inspect the package with
`npm pack --dry-run ./packages/cli`, and perform the initial publication only
after the package identity and trusted-publishing configuration are approved.

For subsequent releases, configure npm Trusted Publishing for GitHub Actions
with repository `juangcarmona/arcshape`, workflow filename `publish.yml`, and
environment `npm-publish`. The environment must have its required human
reviewer configured and no tag-only deployment policy: this workflow publishes
from `main`, like the ProductShape release workflow. The workflow uses
`GITHUB_TOKEN` for repository evidence and OIDC (`id-token: write`) for npm; it
does not use a long-lived npm token.

## Recovery

Run `Release` from GitHub Actions with the `publish-current-stable` operation
when a prior run published the immutable npm version but stopped before
finishing its evidence. The release-state helper compares the committed stable
version with npm:

- `pending` publishes the package;
- `already-published` skips the immutable npm publication and repairs tags,
  the GitHub Release, and the SBOM;
- `inconsistent` fails if npm already contains a newer stable version.

Published prerelease versions, such as `0.0.0-stage`, are ignored when this
stable release state is calculated.

Recovery is idempotent. Never force-move a package tag or replace an npm
version. If a published version is defective, publish a corrected patch version
and deprecate the affected version with a clear explanation.

## Verified publication history

- `@arcshape/cli@0.1.0` was the one-time manual publication on 2026-10-17.
- GitHub Release [`v0.1.1`](https://github.com/juangcarmona/arcshape/releases/tag/v0.1.1)
  published `@arcshape/cli@0.1.1` through GitHub OIDC with npm provenance.
- The first automated run exposed a registry-verification query for the old
  unscoped package name. The verifier now reads the package name from
  `packages/cli/package.json`; the immutable version was not republished.
