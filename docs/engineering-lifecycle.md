# Engineering lifecycle

**Project**: ArcShape **Adopted**: 2026-10-16 · **Last amended**: 2026-10-19

## Definition of Ready

The Ready gate asks whether the problem is sufficiently defined to plan. It is assessed semantically; missing, vague, or contradictory information is surfaced to the submitter rather than silently treated as ready. Blank and rough issues are valid intake: ask for the submitter's intent, triage it, and help complete the general-work or bug template before evaluating readiness.

An item is Ready when each applicable dimension is explicit. Mark inapplicable dimensions `N/A` with a reason.

| # | Dimension | This project requires |
| --- | --- | --- |
| 1 | Title | States the desired outcome, not the activity. |
| 2 | Description | Explains intent, the problem, and relevant context. |
| 3 | Actor / stakeholder | Identifies who needs or is affected by the change when applicable. |
| 4 | Priority | Required only when the team formally prioritizes the work. |
| 5 | Dependencies | Lists known dependencies or explicitly states “none.” |
| 6 | Acceptance criteria | Gives observable, verifiable conditions for success. |
| 7 | Scope | States in-scope and out-of-scope when ambiguity exists. |
| 8 | Product rules | Cites relevant approved product requirements and constraints in `docs/product/model` using [ProductShape](https://github.com/juangcarmona/productshape)/PDAC citations when they exist. |
| 9 | Affected behaviour | Identifies existing workflows or behavior that may change, when applicable. |
| 10 | Quality expectations | States relevant expectations such as security, accessibility, performance, or reliability. |
| 11 | Test impact | Identifies affected or new test scenarios, including E2E scenarios where relevant; detailed test planning belongs to the proposal. |
| 12 | Existing decisions | Links relevant approved product definition in `docs/product/model`, [arc42](https://arc42.org/) architecture documentation in `docs/architecture` when established, and ADRs when relevant. [OpenSpec](https://github.com/Fission-AI/OpenSpec) changes are delivery slices, not sources of trust or durable decisions. |
| 13 | Unknowns / risks | Resolves uncertainty that could invalidate planning; records the rest with its impact and owner where known. |

### Additional to this project

| Dimension | This project requires |
| --- | --- |
| Intake triage | Blank or low-quality issues are not rejected by default. Clarify the submitter's intent and help shape the issue into the applicable template before it can pass Ready. |

## Definition of Done

The Done gate means the change is finished and sufficiently proven for integration. Deterministic evidence and reviewer judgement are both used where appropriate. No check is considered passing merely because it is absent or has not run.

| # | Dimension | This project requires | Lane | Role |
| --- | --- | --- | --- | --- |
| 1 | Acceptance criteria | Every criterion has demonstrable evidence; reviewer judges subjective criteria. | both | Human reviewer |
| 2 | Implementation completeness | Planned scope is complete; dropped work is explained; no placeholders, dead code, or silent scope loss remain. | both | Human reviewer |
| 3 | Tests | Tests fit the change and its risk; unit/integration coverage is expected as tooling is established, E2E is risk-based, and a reviewer judges adequacy. | both | Human reviewer |
| 4 | Quality checks | Format, lint, typecheck, unit tests, and the helper-script build run in CI on supported Node and operating-system combinations. The ArcShape product CLI build remains future work until the CLI exists. | deterministic | none |
| 5 | Security | TruffleHog secret scanning, High/Critical npm dependency auditing, High/Critical CodeQL SAST, runtime SBOM/license policy, and passive DAST run on pull requests and main pushes; security scans also run on a schedule. Mutation analysis is scheduled/manual. Review documented, expiring exceptions and the new assurance reports. New assurance checks remain outside required branch protection pending maintainer acceptance of thresholds and severity policy. | both | Human reviewer |
| 6 | Architecture / design conformance | Review against [arc42](https://arc42.org/) architecture documentation in `docs/architecture` as it is established; record deviations. Until then, do not claim documented conformance. | judgement | Human reviewer |
| 7 | Documentation | Update user, operational, developer, product, or architecture documentation when behavior or decisions change. | both | Human reviewer |
| 8 | Product / spec consistency | Keep the change consistent with the approved [ProductShape](https://github.com/juangcarmona/productshape) model in `docs/product/model`, using PDAC citations. Canonical model artifacts must be active unless explicitly deprecated or retired; draft artifacts belong in proposed Product Changes. [OpenSpec](https://github.com/Fission-AI/OpenSpec) is a temporary delivery slice; archive only the minimum useful delivery context and do not duplicate canonical product or architecture sources. | both | Human reviewer |
| 9 | Evidence | Preserve current-head check results and relevant test/runtime evidence; reviewer confirms the evidence supports the claim. | both | Human reviewer |
| 10 | Human review | The human reviewer reviews and approves the change before merge. | judgement | Human reviewer |
| 11 | Known limitations | State known limitations and residual risks; the reviewer decides whether they are acceptable before merge. | both | Human reviewer |

### Additional to this project

| Dimension | This project requires | Lane | Role |
| --- | --- | --- | --- |
| Phased engineering assurance | Add controls incrementally; do not claim a control is active before it is configured and producing current evidence. The active baseline includes CI, secret/dependency scanning, SAST, and runtime SBOM/license policy. E2E and passive DAST now report on pull requests and main pushes; mutation analysis runs weekly and manually. Their results remain advisory to branch protection until the maintainer accepts observed thresholds and policy. | both | Human reviewer |

### Deterministic checks

The deterministic CI baseline runs on Node 22 and 24 across Ubuntu, Windows, and macOS. It covers maintained TypeScript/JavaScript/config formatting, linting, typechecking, the Vitest suite, and compilation of repository helper scripts. CLI behavior is exercised by unit/integration tests, including a packed npm installation smoke test; `npm run build` compiles repository helper scripts and does not bundle the JavaScript CLI. A separate `Repository conventions` job checks pull request branch names and commit messages.

An active `main` ruleset is confirmed. It requires pull requests, blocks deletion and non-fast-forward updates, and requires the six quality-matrix checks, `Product model`, `Secrets scan`, `Dependency audit`, `SBOM and license policy`, and `Analyze (javascript-typescript)`. The CodeQL job fails on High/Critical security findings. Zero required GitHub approvals is intentional for this single-maintainer project; the human reviewer still owns the Done judgement. `Repository conventions` must be added to the ruleset's required checks after the new job produces a successful result; until then, that policy is checked locally and reported as advisory in CI.

[OpenSpec](https://github.com/Fission-AI/OpenSpec)'s generated archive workflow retains its change artifacts and does not enforce the project's minimal-retention policy. Keep [OpenSpec](https://github.com/Fission-AI/OpenSpec) archives to the minimum useful delivery context where the workflow permits; automated pruning remains follow-up work.

| Check | How it runs | Evidence it produces |
| --- | --- | --- |
| Format | `npm run format:check` in the quality matrix. | Prettier reports maintained code and CI configuration are formatted. |
| Lint | `npm run lint` in the quality matrix. | ESLint reports no configured JavaScript/TypeScript lint violations. |
| Typecheck | `npm run typecheck` in the quality matrix. | TypeScript compiles all maintained helper and test sources without emitting. |
| Unit and integration tests | `npm test` in the quality matrix. | Vitest checks ProductShape model status, CLI behavior, provider and manifest lifecycle, and packed npm package installation. |
| Helper-script build | `npm run build` in the quality matrix. | TypeScript emits repository helper scripts; the JavaScript CLI is covered by tests rather than this build. |
| Product model | `npm run product:model:check` and `npm exec -- prodshape validate --format json`. | Canonical artifacts have accepted statuses and ProductShape reports no model diagnostics. |
| OpenSpec | `npm exec -- openspec validate --all --no-interactive`. | OpenSpec validates any active changes/specs; currently reports no items when none exist. |
| Secret scan | TruffleHog OSS v3.99.2 scans PR commits, main pushes, and full history on the daily schedule with credential verification disabled. | A detected credential blocks the scan; see `SECURITY.md` for false-positive handling. |
| Dependency audit | `npm run security:audit` runs npm audit against the committed lockfile, with Node 22.23.3/npm 10.9.9. | Unexcepted High or Critical vulnerabilities and audit/reporting failures block the check; temporary exceptions require an owner, reason, exact advisory, and expiry. |
| CodeQL SAST | CodeQL Action v4 analyzes JavaScript/TypeScript with the `security-extended` suite on PRs, main pushes, and weekly. A SARIF threshold check blocks security severity High/Critical (7.0+). | The required `Analyze (javascript-typescript)` check publishes findings and fails when a blocking severity is present. See `SECURITY.md` for narrow SAST exception rules. |
| SBOM and license policy | npm 10.9.9 packs and clean-installs the actual package, generates CycloneDX for its runtime transitive graph, validates `security/license-policy.json` and expiring exact-version exceptions, and retains artifacts for 90 days. The Changesets release workflow repeats the quality/security checks, then attaches the versioned SBOM to the GitHub Release after npm publication. | The required `SBOM and license policy` check fails for disallowed/unknown licenses or invalid/expired exceptions; see `SECURITY.md`. |
| End-to-end journeys | `npm run test:e2e` runs Playwright Chromium on Ubuntu/Node 22 in a temporary repository; GitHub Actions retains reports and traces for 30 days. | Exercises CLI onboarding, architecture create/update, and browser access to the generated reader. The `End-to-end journeys` context is not a required merge check pending maintainer review. |
| Passive DAST | `Assurance` builds a same-commit reader preview on the ephemeral Ubuntu runner, serves it on loopback, and runs the pinned ZAP Baseline image in passive mode. Medium and lower findings are reported; the provisional adapter fails on High. JSON/HTML/Markdown reports are retained for 90 days. | The `Passive DAST / ZAP Baseline` context is not a required merge check pending maintainer acceptance of the observed severity policy. No public or production site is scanned. |
| Mutation baseline | `npm run test:mutation` runs Stryker 10.0.0's Vitest runner against `packages/cli/src/bin/init.mjs` and `packages/cli/src/bin/agents/lifecycle.mjs` weekly and on manual dispatch with a 30-minute job limit. Vitest 4.1.11 is pinned because the Stryker 10 runner misselects tests on Vitest 5. The first run examined 787 mutants at a 52.35% total / 61.68% covered score in 2m 9s; the provisional break floor is 45%. A report guard rejects covered surviving mutants for which Stryker executed zero tests and scores below that floor; synthetic fixtures exercise both failures. JSON/HTML reports are retained for 90 days. | Observes mutation behavior and test gaps without consuming the PR matrix budget. The context is not a required merge check pending review of the measured baseline and thresholds. |
| Assurance ownership and reruns | The repository maintainer owns E2E scenarios, mutation targets/thresholds, DAST severity policy, runtime budget, and suppressions. | No automatic retries. Inspect retained evidence, fix or record the cause, and manually rerun; one rerun may verify a demonstrated transient runner failure. Never hide a flake or silently treat it as a pass. |
| Repository conventions | The `Repository conventions` CI job checks pull request branch names and commit messages; Husky runs commitlint on commit and checks branch names before push. | The job reports invalid branch names or commit messages. It is not an enforced merge gate until added to the active ruleset's required checks. |

CI definitions: `.github/workflows/ci.yml`, `.github/workflows/security.yml`, `.github/workflows/codeql.yml`, `.github/workflows/pages.yml`, `.github/workflows/assurance.yml`, and `.github/workflows/publish.yml`. The active `main` ruleset requires `Product model`, all six `Quality / <OS> / Node <version>` checks, `Secrets scan`, `Dependency audit`, `SBOM and license policy`, and the CodeQL analysis/threshold job. It does not yet require the assurance workflow contexts or `Repository conventions`. A separate GitHub approval count is not required; human review remains part of the Done gate.

The package release flow is Changesets-based. Package changes carry a pending
`.changeset/*.md` file; a merge to `main` creates or updates one reviewed
`Version Packages` pull request; and merging that pull request is the only
normal trigger for the protected stable publish job. The job verifies the
committed version, publishes through npm Trusted Publishing with provenance,
and records the package tag, GitHub Release, and SBOM. See
[`docs/releasing.md`](releasing.md) for the operator procedure and recovery
contract.

## Lifecycle stages and states

GitHub Issues is the tracker. GitHub's `OPEN` or `CLOSED` state remains separate from lifecycle status. Every open issue has exactly one canonical `status:*` label. New issues receive `status:backlog`. Preserve type and other non-status labels. A pull request body uses `Closes #<number>` so GitHub closes the issue when the pull request merges to the default branch. A merged issue stays `status:done` while its post-merge retrospective is pending; review debt is determined from the retrospective file and baseline date, not another status label.

| Stage | State on entry | State on exit | Transition | Fired by |
| --- | --- | --- | --- | --- |
| `refine` | `status:backlog` | `status:ready` | Add `status:ready` after the Ready gate passes | `refine` |
| `propose` | `status:ready` | `status:proposed` | Add `status:proposed` after the plan passes review | `propose` |
| `implement` | `status:proposed` | `status:in-progress` → `status:in-review` | Set in-progress on entry; set in-review when the Done gate passes and the PR is ready | `implement` |
| `integrate` | `status:in-review` | `status:done`, issue closed | Merge the linked PR; verify issue closure, then set done | `integrate` |
| `review` | `status:done` | `status:done` | Create the per-item retrospective; no lifecycle transition | `review` |

### Transitions no capability ever fires

Reopening, rejecting, or otherwise closing an issue outside the linked-PR merge flow is a human decision. Agents report the need and do not fire these transitions.

| Transition | Meaning | Who fires it |
| --- | --- | --- |
| Reopen | Resume work on a previously closed issue. | Human only |
| Close outside merge | Reject, abandon, or close an issue without a merged linked pull request. | Human only |

## Work item fields

GitHub issue creation requires a title and body. Lifecycle status is represented by exactly one `status:*` issue label, not by GitHub's open/closed state, a field, or a Project field.

Post-merge retrospective records are stored as `docs/reviews/issue-<number>.md`, with one record per issue and no shared index. The baseline date is 2026-10-19; earlier merges are historical and are excluded from review debt.

| Field | Identifier | Required by | Notes |
| --- | --- | --- | --- |
| Title | GitHub issue `title` | Issue creation | Outcome-oriented. |
| Description | GitHub issue `body` | Issue creation | Markdown shaped by the general-work or bug issue form when available. |

## Label conventions

Lifecycle labels use the shared Agentic SDLC defaults: `status:backlog`, `status:ready`, `status:proposed`, `status:in-progress`, `status:in-review`, and `status:done`. Exactly one is present on each open issue. `blocked` and `owner-review` are optional overlays; classification labels remain independent. The per-item retrospective is `docs/reviews/issue-<number>.md`, with baseline date 2026-10-19. No separate process ledger is used.

## Fast Forward

| Setting | This project requires |
| --- | --- |
| Enabled | Yes when the active harness can attest a distinct reviewer model |
| Executor and reviewer | Resolve at run time; reviewer must be a different model |
| Maximum correction rounds | 3 per gate |
| Substitutable judgement items | None by default |
| Run evidence | `docs/delivery/ff/<work-item-id>/<run-id>/run.json` and `summary.md` |
| Human-only or protected gates | Human review, product-scope or accepted-decision changes, required forge approvals, production publication, and repository red lines |

`/ff` may create or update the PR, push its branch, and merge only after all configured gates pass and repository protection permits it. It never publishes the production site unattended.

## Branch and commit conventions

Create issue-linked branches as `<type>/<issue-number>-<kebab-case-slug>`, for example `feat/47-agent-capability-distribution` or `fix/183-session-resume`. Allowed branch types are `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, and `revert`. Do not use a tool or agent name as a branch prefix.

Use Conventional Commit messages in the form `<type>(<optional-scope>): <description>`, for example `docs(process): define lifecycle labels`, and include a `Refs #<number>` footer on every commit. The pull request body carries `Closes #<number>` to close the linked issue. Husky and commitlint check commits locally; CI checks pull request branch names and commit messages. Local hooks can be bypassed, so the CI convention check must be included in the active `main` ruleset's required checks before the policy is reported as enforced.

## Work in progress

**WIP cap**: Not used **Query used at pickup**: Not used **Sprint commitment**: Not used **Board**: Not used

## Roles

| Role | Who | Decides |
| --- | --- | --- |
| Human reviewer | Repository maintainer (you) | Acceptance criteria, implementation completeness, test adequacy, security risk, architecture conformance, documentation, product consistency, evidence, human review, known limitations, and phased assurance. |

## Installed roles

Role capabilities installed into `.agents/skills/` are the project-owned source. The corresponding `.claude/skills/` files are generated copies; edit the `.agents/skills/` source and refresh the copies. These roles were reset to Agentic SDLC 0.2.2 defaults on 2026-10-19.

| Role skill | Adapted from | Installed | Projected to |
| --- | --- | --- | --- |
| `read-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-19 | Codex, Claude |
| `read-work-item-links` | Agentic SDLC GitHub Issues role template | 2026-10-19 | Codex, Claude |
| `create-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-19 | Codex, Claude |
| `update-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-19 | Codex, Claude |
| `transition-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-19 | Codex, Claude |
| `comment-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-19 | Codex, Claude |
| `create-branch` | Agentic SDLC branch role template | 2026-10-19 | Codex, Claude |
| `checkout-branch` | Agentic SDLC branch role template | 2026-10-19 | Codex, Claude |
| `open-pull-request` | Agentic SDLC GitHub role template | 2026-10-19 | Codex, Claude |
| `inspect-pull-request` | Agentic SDLC GitHub role template | 2026-10-19 | Codex, Claude |
| `update-pull-request` | Agentic SDLC GitHub role template | 2026-10-19 | Codex, Claude |
| `inspect-ci-result` | Agentic SDLC GitHub Actions role template | 2026-10-19 | Codex, Claude |
| `merge-pull-request` | Agentic SDLC GitHub role template | 2026-10-19 | Codex, Claude |

## Provided roles

[OpenSpec](https://github.com/Fission-AI/OpenSpec)'s generated Codex and Claude roles satisfy the proposal/application/spec-sync/archive plan-artifact contracts. Invoke the generated skills/commands from the active harness; these are generated by `npm run openspec:init`, not vendored Agentic SDLC templates.

| Contract | Provided by | Skill to invoke |
| --- | --- | --- |
| `propose-change` | [OpenSpec](https://github.com/Fission-AI/OpenSpec) for Codex | `$openspec-propose` |
| `apply-change` | [OpenSpec](https://github.com/Fission-AI/OpenSpec) for Codex | `$openspec-apply-change` |
| `sync-specs` | [OpenSpec](https://github.com/Fission-AI/OpenSpec) for Codex | `$openspec-sync-specs` |
| `archive-change` | [OpenSpec](https://github.com/Fission-AI/OpenSpec) for Codex | `$openspec-archive-change` |

Claude Code equivalents are `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, and `/opsx:archive`.

## Amendment log

| Date | Section | Change | Why |
| --- | --- | --- | --- |
| 2026-10-16 | All | Adopted initial lifecycle, issue intake, delivery, and assurance policy. | Establish ArcShape's engineering process for Codex and Claude workflows. |
| 2026-10-17 | Lifecycle stages, branch and commit conventions | Added mutually exclusive lifecycle labels, per-issue retrospective records, and issue-linked branch and commit conventions. | Reduce shared-file conflicts and make work traceable across issues, branches, commits, and pull requests. |
| 2026-10-19 | Lifecycle labels, Fast Forward, retrospective baseline | Reset status labels to the shared `status:*` set and configured bounded `/ff` with per-item review records. | Align issue handling and PR integration across repositories while preserving ArcShape's gates. |
| 2026-10-19 | Lifecycle labels, Fast Forward, review baseline | Reset lifecycle labels to the shared `status:*` defaults, kept per-item retrospectives, recorded the legacy-history baseline, and enabled configured `/ff`. | Align issue status, retrospective tracking, and bounded PR integration across repositories. |
