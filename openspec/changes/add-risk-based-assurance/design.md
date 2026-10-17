# Design

<!-- pdac-scope: cited -->

## Context

See `proposal.md` for motivation and the product impact analysis. The current test command is Vitest and CI already runs it across three operating systems and two Node versions. Mutation analysis, browser E2E, and DAST have no baseline in this repository, so their first thresholds and runtime budgets must be measured rather than guessed.

The browser and DAST targets are generated reader output. CI can build that output from a synthetic fixture and serve it on loopback for the duration of a job. No external site or adopter repository is needed.

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->

## Goals / Non-Goals

**Goals:**

- Keep the added assurance isolated from the existing cross-platform fast feedback matrix.
- Make each new signal reproducible, bounded in runtime, and traceable to a representative fixture or scenario.
- Preserve reports so maintainers can judge thresholds, runtime, and flakiness before considering required status checks.
- Limit scans to a synthetic, ephemeral local preview.

**Non-Goals:**

- Changing ArcShape product behavior or product requirements.
- Scanning production, public Pages, adopter repositories, or authenticated systems.
- Enabling any new required branch-protection check before a maintainer reviews the observed evidence and accepts the policy.
- Claiming that automated browser checks measure reader comprehension.

## Decisions

### Isolate assurance in a dedicated workflow

Add a dedicated workflow, separate from the six-cell quality matrix. Run browser E2E and the passive DAST scan on Ubuntu with Node 22, use explicit job and command timeouts, and upload reports with finite retention even on failure. Run the initial mutation baseline on a schedule and manually; PR mutation runs can be scoped to changed high-risk modules once runtime is measured. Do not put an unbounded full mutation run on every matrix cell.

**Alternative considered:** put all jobs in `ci.yml`. Rejected because browser installation and mutation analysis would inflate every platform job and couple fast unit feedback to long-running assurance.

### Use Playwright for a small set of user journeys

Use pinned `@playwright/test` and its supported browser installation. Exercise the CLI onboarding and architecture create/update flow with temporary fixture repositories, then inspect the resulting reader pages through a locally served generated site. Keep scenarios to observable contract points and avoid duplicating the full unit suite in a browser.

**Alternative considered:** introduce a browser test for every CLI command. Rejected because most commands have better deterministic coverage at the existing unit/integration layer and browser tests have higher cost and flakiness risk.

### Establish mutation targets and thresholds from observed behavior

Use pinned StrykerJS with its Vitest runner against a deliberately bounded set of high-risk modules. First run a baseline, retain the report, and record surviving mutants and exclusions. Set per-target thresholds only after reviewing whether surviving mutants expose real test gaps or equivalent/unreachable transformations. Keep mutation execution scheduled/manual until its measured duration supports a safe PR budget; if a targeted PR run is added, explicitly report the selected files and never silently skip an over-budget run.

**Alternative considered:** enforce one global score immediately. Rejected because it would make the gate arbitrary, encourage low-value score optimization, and obscure differences between module risk and mutation applicability.

### Scan only an ephemeral preview with ZAP Baseline

Build a synthetic reader site, serve it on loopback, and run the official ZAP Baseline container against that exact URL. The baseline scan is passive; do not enable active attack rules. Add a synthetic vulnerable fixture or controlled alert fixture that verifies the severity-policy adapter blocks the agreed blocking severity. Ensure all processes are stopped and artifacts are retained on success or failure.

Use a proposed initial policy of failing on High findings while reporting Medium and below, but label this provisional in documentation and workflow. Keep the job informational until a maintainer reviews both the policy and representative results. If the baseline scan cannot reliably distinguish ArcShape-owned findings from tool/browser noise, document a narrow, reviewed suppression with rationale and expiry instead of broadly suppressing an alert class.

**Alternative considered:** scan the deployed Pages site. Rejected because production scans create external side effects, can drift from the tested commit, and cannot safely host synthetic verification fixtures.

### Keep new checks advisory until explicit acceptance

The workflow may report failure for its own proposed threshold so that the signal is visible, but do not add its status contexts to the active required-check ruleset as part of this change. Document the exact contexts and the maintainer action needed to promote them. If review rejects a threshold or finds unstable behavior, revise the policy or leave that signal advisory; do not hide instability with automatic retries or convert the job to a silent success.

**Alternative considered:** require the new checks as soon as they are added. Rejected because no observed baseline or maintainer-approved thresholds exist yet.

### Record operations and evidence alongside the workflows

Update engineering lifecycle, security, and architecture quality/deployment documentation with scenarios, changed-file targeting, trigger schedule, runtime budget, flakiness/rerun policy, ownership, severity policy, artifact retention, and known blind spots. CI output should identify the tested commit and tool versions.

**Alternative considered:** rely on workflow YAML as the only policy record. Rejected because it does not explain threshold rationale, ownership, or safe future promotion to required checks.

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->

## Risks / Trade-offs

- [Browser tooling increases setup time and may be flaky on hosted runners] → Keep the suite short, Linux-only, finite, artifact-backed, and separate from the cross-platform matrix; report reruns rather than masking failures.
- [Mutation score may reward irrelevant or equivalent mutants] → Review examples and survivors, target a small set of risk-based modules, and justify thresholds from the baseline.
- [Passive DAST may produce noisy or context-free alerts] → Use only a local synthetic preview, start with an explicit provisional severity policy, and require reviewed narrow suppressions.
- [New workflow cost may exceed its value] → Measure wall time and artifact size and document a bounded schedule before considering PR gating.
- [Tool updates can change findings or runtime] → Pin direct tool versions and record versions in the run output; update deliberately with baseline comparison.

## Migration Plan

1. Add pinned test/scanner tooling and isolated workflows without changing existing required checks.
2. Run representative synthetic fixtures and collect baseline reports, duration, and findings.
3. Review thresholds, severity policy, flakiness and ownership against issue #15 acceptance criteria; revise while advisory.
4. Keep checks advisory until a maintainer explicitly accepts promotion. Promotion is a separate ruleset change with the exact status contexts documented.
5. Rollback by disabling the dedicated workflow or reverting its commit; existing CI and security gates remain independent.

## Open Questions

- Which mutation targets provide useful signal at an acceptable measured runtime? Resolve from the baseline before setting the final target list.
- What artifact retention period best balances reviewability and storage? Start with the repository's existing 90-day security-report precedent and adjust from observed use.
- Is High-only the right ZAP blocking threshold for the synthetic generated site? It remains provisional pending human review of actual baseline findings.

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
