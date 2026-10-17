# Releasing ArcShape

## First npm publication

The first publication is a one-time maintainer action after the implementation is merged and the package name is confirmed available. This repository is configured to publish the unscoped `arcshape` package publicly.

1. Confirm `arcshape` is still unclaimed with `npm view arcshape version` and verify the publishing account has access.
2. Review the package metadata and file list with `npm pack --dry-run`.
3. From a clean checkout of the reviewed commit, install the tarball in a temporary project and run `arcshape --version`, `arcshape init`, `arcshape validate --links`, and `arcshape site build`.
4. Confirm Node.js 24 and npm access, then publish once with `npm publish --access public`. Do not commit credentials or add a long-lived npm token to GitHub.
5. Verify the registry reports the expected version and inspect the package page.

## Trusted publishing for later releases

After the first package exists on npm:

1. Configure an [npm Trusted Publisher](https://docs.npmjs.com/trusted-publishers) with GitHub Actions, user or organization `juangcarmona`, repository `arcshape`, workflow filename `publish.yml` (enter the filename only), and environment `npm-publish`. Allow direct `npm publish`, which is the command used by this workflow.
2. Configure the GitHub `npm-publish` environment with a required human reviewer. Allow release tags matching `v*`; the workflow also verifies each tagged commit is already an ancestor of `origin/main`.
3. Prepare and merge a reviewed version change. Create a matching `v<package.json version>` tag and GitHub Release.
4. Publish the GitHub Release. The workflow verifies the package, waits for approval at `npm-publish`, publishes with GitHub OIDC and provenance, and checks the registry version afterward.

The environment currently names the repository owner as its only required reviewer, so self-review prevention is disabled to keep releases possible. To enforce separation of duties, add a second trusted reviewer before enabling self-review prevention. npm Trusted Publisher configuration must complete its first successful publish within two days; configure it only when the next tagged release is ready to run.

The workflow has read-only repository access during verification. Only the publish job receives `id-token: write`; it uses Node.js 24 and npm 11.5.1 or newer for npm Trusted Publishing. It does not use an npm token.

## Recovery

npm versions are immutable. If a release contains a defect, do not attempt to replace the published version or force-move its tag. Publish a corrected patch version and mark the broken version deprecated with a clear message. For a compromised package, disable the Trusted Publisher, revoke account sessions, contact npm support, and publish forward from a reviewed commit after restoring trust. Keep the GitHub Release and provenance record as audit evidence.
