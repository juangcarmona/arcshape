# Engineering lifecycle

**Project**: ArcShape **Adopted**: 2026-10-16 · **Last amended**: 2026-10-16

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
| 5 | Security | TruffleHog secret scanning and High/Critical npm dependency auditing run on pull requests, main pushes, and scheduled scans. Review documented exceptions; SAST, SBOM/license, mutation, and DAST controls are phased later. | both | Human reviewer |
| 6 | Architecture / design conformance | Review against [arc42](https://arc42.org/) architecture documentation in `docs/architecture` as it is established; record deviations. Until then, do not claim documented conformance. | judgement | Human reviewer |
| 7 | Documentation | Update user, operational, developer, product, or architecture documentation when behavior or decisions change. | both | Human reviewer |
| 8 | Product / spec consistency | Keep the change consistent with the approved [ProductShape](https://github.com/juangcarmona/productshape) model in `docs/product/model`, using PDAC citations. Canonical model artifacts must be active unless explicitly deprecated or retired; draft artifacts belong in proposed Product Changes. [OpenSpec](https://github.com/Fission-AI/OpenSpec) is a temporary delivery slice; archive only the minimum useful delivery context and do not duplicate canonical product or architecture sources. | both | Human reviewer |
| 9 | Evidence | Preserve current-head check results and relevant test/runtime evidence; reviewer confirms the evidence supports the claim. | both | Human reviewer |
| 10 | Human review | The human reviewer reviews and approves the change before merge. | judgement | Human reviewer |
| 11 | Known limitations | State known limitations and residual risks; the reviewer decides whether they are acceptable before merge. | both | Human reviewer |

### Additional to this project

| Dimension | This project requires | Lane | Role |
| --- | --- | --- | --- |
| Phased engineering assurance | Add controls incrementally, beginning with the baseline CI checks and secret/dependency scanning; do not claim a control is active before it is configured and producing current evidence. | both | Human reviewer |

### Deterministic checks

The deterministic CI baseline runs on Node 22 and 24 across Ubuntu, Windows, and macOS. It covers maintained TypeScript/JavaScript/config formatting, linting, typechecking, the Vitest suite, and compilation of repository helper scripts. CLI behavior is exercised by unit/integration tests, including a packed npm installation smoke test; `npm run build` compiles repository helper scripts and does not bundle the JavaScript CLI. A separate `Repository conventions` job checks pull request branch names and commit messages.

An active `main` ruleset is confirmed. It requires pull requests, blocks deletion and non-fast-forward updates, and currently requires the six quality-matrix checks, `Product model`, `Secrets scan`, and `Dependency audit`. Zero required GitHub approvals is intentional for this single-maintainer project; the human reviewer still owns the Done judgement. `Repository conventions` must be added to the ruleset's required checks after the new job produces a successful result; until then, that policy is checked locally and reported as advisory in CI.

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
| Repository conventions | The `Repository conventions` CI job checks pull request branch names and commit messages; Husky runs commitlint on commit and checks branch names before push. | The job reports invalid branch names or commit messages. It is not an enforced merge gate until added to the active ruleset's required checks. |

CI definitions: `.github/workflows/ci.yml` and `.github/workflows/security.yml`. The active `main` ruleset requires `Product model`, all six `Quality / <OS> / Node <version>` checks, `Secrets scan`, and `Dependency audit`. Add `Repository conventions` to that list after its first successful run. A separate GitHub approval count is not required; human review remains part of the Done gate.

## Lifecycle stages and states

GitHub Issues is the tracker. GitHub issue state remains `OPEN` or `CLOSED`; one mutually exclusive `stage:*` label records the lifecycle stage. Preserve type and other non-stage labels. New issues receive `stage:refine`. Change the stage label at each confirmed lifecycle transition. A pull request body uses `Closes #<number>` so GitHub closes the issue when the pull request merges to the default branch. The merged issue receives `stage:review` while its retrospective is pending; remove that label when review is complete. Do not infer a stage when no `stage:*` label exists or when multiple stage labels exist.

| Stage | State on entry | State on exit | Transition | Fired by |
| --- | --- | --- | --- | --- |
| `refine` | `OPEN` | `OPEN` | `stage:refine` | `create-work-item` when creating the issue |
| `propose` | `OPEN` | `OPEN` | `stage:propose` | `transition-work-item` when refinement exits and proposal begins |
| `implement` | `OPEN` | `OPEN` | `stage:implement` | `transition-work-item` after proposal approval |
| `integrate` | `OPEN` | `CLOSED` | `stage:integrate` and `Closes #<number>` | `transition-work-item` before merge; GitHub closes the issue when the linked pull request merges |
| `review` | `CLOSED` | `CLOSED` | Apply `stage:review` after merge, then remove it at review completion | `integrate` applies it after merge; `review` removes it via `transition-work-item` |

### Transitions no capability ever fires

Reopening, rejecting, or otherwise closing an issue outside the linked-PR merge flow is a human decision. Agents report the need and do not fire these transitions.

| Transition | Meaning | Who fires it |
| --- | --- | --- |
| Reopen | Resume work on a previously closed issue. | Human only |
| Close outside merge | Reject, abandon, or close an issue without a merged linked pull request. | Human only |

## Work item fields

GitHub issue creation requires a title and body. Lifecycle stage is represented by exactly one `stage:*` issue label when a stage is active, not by a GitHub issue state, field, or Project field.

Post-merge retrospective records are stored as `docs/reviews/issue-<number>.md`, with one record per issue and no shared index.

| Field | Identifier | Required by | Notes |
| --- | --- | --- | --- |
| Title | GitHub issue `title` | Issue creation | Outcome-oriented. |
| Description | GitHub issue `body` | Issue creation | Markdown shaped by the general-work or bug issue form when available. |

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

Role capabilities installed into `.agents/skills/` are the project-owned source. The corresponding `.claude/skills/` files are copies; edit the `.agents/skills/` source and refresh the copies.

| Role skill | Adapted from | Installed | Projected to |
| --- | --- | --- | --- |
| `read-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-16 | Codex, Claude |
| `create-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-16 | Codex, Claude |
| `update-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-16 | Codex, Claude |
| `transition-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-16 | Codex, Claude |
| `comment-work-item` | Agentic SDLC GitHub Issues role template | 2026-10-16 | Codex, Claude |
| `create-branch` | Agentic SDLC branch role template | 2026-10-16 | Codex, Claude |
| `checkout-branch` | Agentic SDLC branch role template | 2026-10-16 | Codex, Claude |
| `open-pull-request` | Agentic SDLC GitHub role template | 2026-10-16 | Codex, Claude |
| `inspect-pull-request` | Agentic SDLC GitHub role template | 2026-10-16 | Codex, Claude |
| `update-pull-request` | Agentic SDLC GitHub role template | 2026-10-16 | Codex, Claude |
| `inspect-ci-result` | Agentic SDLC GitHub Actions role template | 2026-10-16 | Codex, Claude |
| `merge-pull-request` | Agentic SDLC GitHub role template | 2026-10-16 | Codex, Claude |

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
