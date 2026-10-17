# Proposal

<!-- pdac-scope: cited -->

## Why

ArcShape's current CI has unit and integration tests, static analysis, and dependency controls, but it does not exercise complete maintainer and reader journeys, measure whether tests detect plausible logic defects, or probe the generated site at runtime. This change adds evidence-based assurance while keeping scans isolated, controlling CI cost, and requiring maintainer review before new checks become merge gates.

## What Changes

- Add a small end-to-end suite for the supported onboarding, architecture generation/update, and reader journeys, using temporary repositories and a local preview server.
- Baseline mutation testing on selected high-risk modules; define and justify thresholds from observed mutation results rather than adopting a global score without evidence.
- Run a passive DAST scan against an ephemeral CI preview of the generated reader site, with an explicit severity policy and safe synthetic verification.
- Document runtime, flakiness, owners, reports, and retry policy. Keep new checks outside the required `main` ruleset until the maintainer reviews and accepts their thresholds.

## Capabilities

### New Capabilities

None. This change adds repository test and CI assurance; it does not add adopter-visible product behavior.

### Modified Capabilities

None. Existing onboarding, CLI, architecture-documentation, and reader behavior is being verified, not changed. The change declares `skip_specs: true` because no product behavior specification changes.

## Impact

- **Code and tests:** `bin/`, `tools/arc42-site/`, the existing Vitest suite, and a new `tests/e2e/` suite. Initial mutation candidates are file-safe onboarding and provider lifecycle code, validation/rendering paths, and the security policy helpers; the baseline determines the final bounded target set.
- **CI:** Add a dedicated assurance workflow with finite per-job limits, a Linux/Node 22 browser run, scheduled mutation baseline, and a DAST scan of the same-run preview. Reports are retained as CI artifacts. The preview is served only on the ephemeral runner; no public or production URL, adopter repository, credential, or production secret is a scan target.
- **Dependencies:** Evaluate pinned `@playwright/test`, StrykerJS with its Vitest runner, and the official OWASP ZAP Docker image. Use the passive ZAP baseline scan, not an active scan. Tool versions and runtime budgets are recorded when implementation measures the baseline.
- **Operations and docs:** Update `docs/engineering-lifecycle.md`, `SECURITY.md`, and the relevant architecture deployment/quality sections with triggers, policy, owners, cost, artifact retention, and limitations. Do not add these checks to the required `main` ruleset until the maintainer accepts the proposed thresholds.

### Product-definition impact

These are the active product requirements and constraints whose behavior the assurance scenarios exercise; the product model itself is not changed.

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:c640cc080f41323f458ac4e1a6124b802277bca2baa73c80fd720df48b286623" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->
<!-- pdac:cite id="UC-ONBOARD-REPOSITORY" digest="sha256:ac5e91032100634e83b8d426343000decfc67811e30c00f6a9838e67305dce01" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DOCS" digest="sha256:56eed38bb2e4d4fc4a4bd697f3e1895a41e43699cf3d921f08047636716811d8" -->
<!-- pdac:cite id="UC-MAINTAIN-ARCHITECTURE-DOCS" digest="sha256:754736cb3244d69eb54714a733d8b2488c52a25fe568817c4717bd1fde8d8c0f" -->
<!-- pdac:cite id="UC-PUBLISH-ARCHITECTURE-VIEW" digest="sha256:9ce6cd65b911aeec3601b986283f966a0232a1c59a3534f975fff4c3abddea9c" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->
<!-- pdac:cite id="JRN-ESTABLISH-ARCHITECTURE-DOCS" digest="sha256:8406837b4513d30ee73c5fea029eb1f0bb168dcdafd17508f2de005a944a8a8e" -->
<!-- pdac:cite id="JRN-UNDERSTAND-ARCHITECTURE" digest="sha256:51c7e69a4b37e8598dbd5731e321d12f4bc584bb9dcd54c768011542aab5b85e" -->

Structural neighbors checked and left out: ADR and C4 authoring, reverse engineering, external documentation sync, ProductShape linking, and the qualitative reader-comprehension requirement. These controls do not change or claim to measure those behaviors. In particular, browser navigation checks do not replace the human comprehension study in `QR-READER-COMPREHENSION`. The assurance target is internal CI and an ephemeral site preview; it does not create an ArcShape-hosted service or collect adopter data.

No ProductShape drift is proposed: all changes are internal assurance for existing behavior, and the model explicitly distinguishes product outcomes from ArcShape's implementation architecture. No Product Change is required.

## References

- Playwright CI setup and finite test-run configuration: [Playwright CI documentation](https://playwright.dev/docs/ci).
- StrykerJS's Vitest runner and mutation thresholds: [Vitest runner](https://stryker-mutator.io/docs/stryker-js/vitest-runner/) and [configuration](https://stryker-mutator.io/docs/stryker-js/configuration/).
- ZAP baseline scanning is a time-limited spider with passive checks and no active attacks: [ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/) and [ZAP Docker documentation](https://www.zaproxy.org/docs/docker/).
