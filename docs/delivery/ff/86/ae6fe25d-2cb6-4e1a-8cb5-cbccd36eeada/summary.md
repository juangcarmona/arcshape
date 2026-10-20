# Fast Forward run

- Work item: #86 — Adopt the ProductShape Changesets release flow
- Branch: `chore/86-changesets-release-flow`
- Starting commit: `74f51c8`
- Executor: `gpt-5`
- Independent reviewer: `gpt-6-luna`
- Correction limit: 3 per gate
- Status: **blocked at human review/integration gate; implementation complete**

The run starts from `origin/main` in a dedicated worktree so the existing
`chore/84-release-0-1-2` checkout remains untouched.

Refine passed the Ready gate. The issue moved to `status:ready`. Existing
review debt was reported for merged post-baseline items #69, #70, #75, #77,
#79, #81, #83, and #85; it does not block this run.

The first independent plan review requested one correction: the issue had
been moved to `status:proposed` before the plan gate. Round 1 restored
`status:ready`; the plan itself was found coherent and complete. The review
was repeated by the independent `gpt-6-luna` reviewer and approved with no
remaining findings. Implementation proceeded and completed at
`0f3260496b2430a4240a62ca7d66ec06460b9243`.

## Implementation and verification

- Added Changesets v2.31.1, `.changeset` configuration and contributor
  guidance, and `version`/`release` package scripts.
- Replaced release-event publication with a ProductShape-style flow: merged
  changesets maintain one `Version Packages` PR; the protected stable job runs
  only from that release commit or the explicit recovery dispatch.
- Added npm-state recovery (`pending`, `already-published`, `inconsistent`),
  provenance publication, registry verification, idempotent package/GitHub
  release evidence, exact tag-to-commit verification, and SBOM attachment.
- Updated release/lifecycle/security documentation and added Changesets
  generation, release-state, and workflow contract tests.
- Local checks passed, including the full CI-equivalent test suite under
  `GITHUB_ACTIONS=true` (26 files, 119 tests, 1 skipped), npm 10.9.9 SBOM and
  license policy, ProductShape model validation, and OpenSpec validation.
- Current-head GitHub checks passed: CI run `39499802347`, Security run
  `39499802289`, CodeQL run `39499801994`, Assurance run `39499802451`, and
  engineering portal build `39499802048`. Mutation analysis was skipped by its
  scheduled/manual workflow condition.
- The active `main` ruleset was verified via ruleset `25255343`; the
  `npm-publish` environment was verified with a required reviewer. npm Trusted
  Publisher configuration remains unverified outside GitHub repository state.

The independent `gpt-6-luna` Done-gate rerun approved the current head after
the merge-commit trigger and exact release-evidence corrections. PR #87 is
ready for review. The run stops before integration because human review/merge
and external npm Trusted Publisher verification remain required; no merge or
real package publication was performed.
