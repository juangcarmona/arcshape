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
| 8 | Product rules | Cites relevant approved product requirements and constraints in `docs/product/model` using ProductShape/PDAC citations when they exist. |
| 9 | Affected behaviour | Identifies existing workflows or behavior that may change, when applicable. |
| 10 | Quality expectations | States relevant expectations such as security, accessibility, performance, or reliability. |
| 11 | Test impact | Identifies affected or new test scenarios, including E2E scenarios where relevant; detailed test planning belongs to the proposal. |
| 12 | Existing decisions | Links relevant approved product definition in `docs/product/model`, arc42 architecture documentation in `docs/architecture` when established, and ADRs when relevant. OpenSpec changes are delivery slices, not sources of trust or durable decisions. |
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
| 4 | Quality checks | Once CI exists, the initial baseline is format/lint, typecheck, unit tests, and build. No such checks are configured or passing today. | deterministic | none |
| 5 | Security | Human risk judgement applies now. Secret and dependency scanning are the next security task; SAST, SBOM/license, mutation, and DAST controls are phased later. | both | Human reviewer |
| 6 | Architecture / design conformance | Review against arc42 architecture documentation in `docs/architecture` as it is established; record deviations. Until then, do not claim documented conformance. | judgement | Human reviewer |
| 7 | Documentation | Update user, operational, developer, product, or architecture documentation when behavior or decisions change. | both | Human reviewer |
| 8 | Product / spec consistency | Keep the change consistent with the approved ProductShape model in `docs/product/model`, using PDAC citations. OpenSpec is a temporary delivery slice; archive only the minimum useful delivery context and do not duplicate canonical product or architecture sources. | both | Human reviewer |
| 9 | Evidence | Preserve current-head check results and relevant test/runtime evidence; reviewer confirms the evidence supports the claim. | both | Human reviewer |
| 10 | Human review | The human reviewer reviews and approves the change before merge. | judgement | Human reviewer |
| 11 | Known limitations | State known limitations and residual risks; the reviewer decides whether they are acceptable before merge. | both | Human reviewer |

### Additional to this project

| Dimension | This project requires | Lane | Role |
| --- | --- | --- | --- |
| Phased engineering assurance | Add controls incrementally, beginning with the baseline CI checks and secret/dependency scanning; do not claim a control is active before it is configured and producing current evidence. | both | Human reviewer |

### Deterministic checks

No deterministic CI checks are configured today. The first CI baseline is expected to cover format/lint, typecheck, unit tests, and build. The follow-up work must select and configure actual commands and required checks; until then these checks have no result and cannot pass.

Main-branch protection is unverified: no repository rulesets were visible, and the GitHub integration could not read branch-protection settings. Do not claim that required checks or review rules are enforced until a maintainer verifies them.

OpenSpec's generated archive workflow retains its change artifacts and does not enforce the project's minimal-retention policy. Keep OpenSpec archives to the minimum useful delivery context where the workflow permits; automated pruning remains follow-up work.

| Check | How it runs | Evidence it produces |
| --- | --- | --- |
| Format/lint | Not configured; establish in the initial CI work. | No result until configured and run for the current revision. |
| Typecheck | Not configured; establish in the initial CI work. | No result until configured and run for the current revision. |
| Unit tests | Not configured; establish a suitable test framework and command in the initial CI work. | No result until configured and run for the current revision. |
| Build | Not configured; establish in the initial CI work. | No result until configured and run for the current revision. |

## Lifecycle stages and states

GitHub Issues is the tracker. Issues remain `OPEN` through refinement, proposal, and implementation. A pull request body uses `Closes #<number>` so GitHub closes the issue when the pull request merges to the default branch. There are no project status labels or board fields configured for intermediate lifecycle states.

| Stage | State on entry | State on exit | Transition | Fired by |
| --- | --- | --- | --- | --- |
| `refine` | `OPEN` | `OPEN` | - | - |
| `propose` | `OPEN` | `OPEN` | - | - |
| `implement` | `OPEN` | `OPEN` | - | - |
| `integrate` | `OPEN` | `CLOSED` | `Closes #<number>` | GitHub when the linked pull request merges |
| `review` | `CLOSED` | `CLOSED` | - | - |

### Transitions no capability ever fires

Reopening, rejecting, or otherwise closing an issue outside the linked-PR merge flow is a human decision. Agents report the need and do not fire these transitions.

| Transition | Meaning | Who fires it |
| --- | --- | --- |
| Reopen | Resume work on a previously closed issue. | Human only |
| Close outside merge | Reject, abandon, or close an issue without a merged linked pull request. | Human only |

## Work item fields

GitHub issue creation requires a title and body. No additional tracker fields, status labels, or project fields are configured.

| Field | Identifier | Required by | Notes |
| --- | --- | --- | --- |
| Title | GitHub issue `title` | Issue creation | Outcome-oriented. |
| Description | GitHub issue `body` | Issue creation | Markdown shaped by the general-work or bug issue form when available. |

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

OpenSpec's generated Codex and Claude roles satisfy the proposal/application/spec-sync/archive plan-artifact contracts. Invoke the generated skills/commands from the active harness; these are generated by `npm run openspec:init`, not vendored Agentic SDLC templates.

| Contract | Provided by | Skill to invoke |
| --- | --- | --- |
| `propose-change` | OpenSpec for Codex | `$openspec-propose` |
| `apply-change` | OpenSpec for Codex | `$openspec-apply-change` |
| `sync-specs` | OpenSpec for Codex | `$openspec-sync-specs` |
| `archive-change` | OpenSpec for Codex | `$openspec-archive-change` |

Claude Code equivalents are `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, and `/opsx:archive`.

## Amendment log

| Date | Section | Change | Why |
| --- | --- | --- | --- |
| 2026-10-16 | All | Adopted initial lifecycle, issue intake, delivery, and assurance policy. | Establish ArcShape's engineering process for Codex and Claude workflows. |
