# Tasks

<!-- pdac-scope: cited -->

## 1. Establish bounded assurance tooling

- [x] 1.1 Pin Playwright, StrykerJS, its Vitest runner, and compatible Vitest 4.x versions; verify the mutation report executes tests per mutant and `npm ci`, lockfile consistency, and package scripts work on Node 22.
- [x] 1.2 Add an isolated assurance workflow with explicit job and command timeouts, manual/scheduled triggers, report upload on failure, and no required-ruleset changes; verify workflow syntax and that the existing CI workflow remains unchanged in required contexts.

## 2. Add journey coverage

- [x] 2.1 Add a small Playwright E2E suite using temporary fixture repositories for onboarding and architecture create/update; verify the scenarios pass against a local generated reader preview and leave no fixture artifacts behind.
- [x] 2.2 Add reader journey assertions for generated navigation and core page access; verify tests fail when a representative generated link or page is deliberately broken.
- [x] 2.3 Document scenario ownership, trigger, runtime budget, artifact retention, flakiness reporting, and rerun policy in engineering lifecycle and architecture quality documentation; verify documented commands match workflow commands.

## 3. Establish mutation baseline

- [x] 3.1 Configure Stryker's Vitest runner for `bin/init.mjs` and `bin/agents/lifecycle.mjs`; record the 2026-10-17 baseline (52.35% total, 61.68% covered, 787 mutants, 2m 9s) and set a provisional 45% break floor; verify the report lists survivors/timeouts and each covered mutant ran tests.
- [x] 3.2 Add safe synthetic mutation-gate verification and document the observed target selection, thresholds, exclusions, measured duration, and ownership; verify the fixture demonstrates that the configured threshold rejects a representative surviving mutant.
- [x] 3.3 Keep full mutation runs scheduled/manual until measured runtime supports targeted PR execution; verify PR workflow behavior reports when a mutation job is skipped or exceeds its budget rather than silently passing.

## 4. Add isolated passive DAST

- [x] 4.1 Build and serve a synthetic reader preview on loopback for the duration of the assurance job, then run the pinned OWASP ZAP Baseline image with bounded duration and passive checks only; verify the scan target is the same-run local preview and no external URL is contacted.
- [x] 4.2 Add a controlled synthetic finding to verify the provisional severity-policy adapter blocks the proposed High severity and reports lower severities; verify the report includes the target commit and that no production/adopter data or credentials are used.
- [x] 4.3 Document the provisional severity policy, reviewed-suppression rules, scan limitations, ownership, runtime, artifact retention, and non-required status; verify the workflow retains the report on both success and failure.

## 5. Integrate and review evidence

- [x] 5.1 Run the assurance workflow locally or through a workflow dispatch and record E2E results, mutation baseline, DAST findings, runtime, flakiness observations, and tool versions; verify each issue #15 acceptance criterion maps to visible evidence.
- [x] 5.2 Update `SECURITY.md`, `docs/engineering-lifecycle.md`, and relevant architecture quality/deployment docs with the final measured policy; verify links and exact check contexts, and confirm no new context was added to required branch protection.
- [x] 5.3 Run repository format, lint, typecheck, unit/build, product-model, citation, and OpenSpec validation commands; verify all pass before requesting review.

The onboarding and reader journey scenarios exercise these accepted product behaviors:

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->

## Workflow follow-up

- Archive result verified on the integration branch before merge.
- Keep any proposed new status checks advisory until the maintainer reviews and accepts thresholds and severity policy; promotion requires a separate explicit ruleset update.
