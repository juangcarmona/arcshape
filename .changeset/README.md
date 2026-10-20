# Changesets

This directory records release intent for the published `@arcshape/cli`
package. A pull request that changes the published package must include a
Changeset describing the user-facing change and the required semantic version
bump.

Run:

```bash
npm exec -- changeset
```

Choose `patch`, `minor`, or `major` according to the compatibility impact and
write a concise release note for users. Commit the generated
`.changeset/<name>.md` file with the feature pull request.

Changesets accumulate only after their pull requests merge into `main`. The
release workflow then creates or updates one `Version Packages` pull request,
which is reviewed and merged when the maintainer wants to publish the
accumulated changes. A process-only or documentation-only change that does not
alter the published package does not need a Changeset.

See [`docs/releasing.md`](../docs/releasing.md) for the complete stable
release, publication, and recovery flow.
