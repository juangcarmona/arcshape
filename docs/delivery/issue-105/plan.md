# Plan: unblock Changesets release gates

Work item: [#105](https://github.com/juangcarmona/arcshape/issues/105)

## Problem

The v0.1.5 Changesets `Version Packages` pull request cannot pass the repository's pull-request checks. The repository convention checker rejects the reserved automation branch `changeset-release/main`, and the dependency audit fails because the committed `GHSA-vfj7-8cjw-p6xm` exceptions no longer match the current npm audit graph. The same audit failure is present on `main` after the reader PR merge.

## Design

1. Keep the developer branch convention strict for issue-linked branches.
2. Allow only the exact Changesets branch `changeset-release/main` as a reserved automation exception. This branch is already documented as the release automation branch and is not a developer branch.
3. Remove dependency exceptions that the current audit graph does not match. Do not add a broad advisory or package suppression; the audit gate remains fail-closed for unmatched High/Critical findings.
4. Add focused tests for the branch rule and audit exception behavior, and document the CI exception alongside the existing release procedure.

## Tasks

- [x] Update `scripts/check-branch-name.mjs` to accept only the reserved Changesets branch in addition to normal issue-linked branches.
- [x] Remove stale `GHSA-vfj7-8cjw-p6xm` entries from `security/dependency-exceptions.json`.
- [x] Add or update tests proving the reserved branch is accepted, ordinary invalid branches remain rejected, and unmatched exceptions remain blocking.
- [x] Document the reserved branch validation exception in `docs/releasing.md`.
- [ ] Run the full deterministic CI-equivalent checks and verify the current release PR checks.

## Test plan

- Run the branch checker for a valid developer branch, an invalid branch, and `changeset-release/main`.
- Run the existing npm audit gate tests and `npm run security:audit` against the committed lockfile.
- Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, product-model/OpenSpec validation, and the relevant assurance checks.
- Confirm the current Version Packages PR no longer fails `Repository conventions` or `Dependency audit`.

## Definition of Done impact

- Deterministic quality and security checks must pass.
- The release process documentation and evidence must match the implementation.
- No security finding may be waived; only stale exception records are removed.
- Human review remains required before merging and before the protected publish environment runs.
