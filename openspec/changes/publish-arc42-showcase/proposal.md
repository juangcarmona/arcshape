<!-- pdac-scope: cited -->

# Proposal

## Why

ArcShape's static reader and engineering portal can present an architecture narrative with Mermaid and Archify, but the repository does not yet provide a polished, end-to-end example that lets adopters assess those capabilities. Issue #80 asks for a coherent showcase and E2E coverage so the experience is reviewable and remains reproducible.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## What Changes

- Add a clearly labeled, fictional example Arc42 set with a coherent system story and diagrams chosen for clarity: Mermaid where source-linked architecture flow is useful, and Archify for the enhanced static HTML diagram experience.
- Link the built showcase from the engineering portal and make both root and `/arcshape/` hosting paths work.
- Extend Playwright to follow the portal link and verify the published experience, renderer identity, accessible names, source/revision provenance, keyboard access, and narrow-screen layout.
- Commit desktop and narrow screenshots with an evidence README recording source revision, viewport dimensions, observed results, the linked Actions report/trace, and what the evidence does not establish.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The example and E2E coverage exercise existing static documentation and reader behavior; they do not change canonical product behavior. This change opts out of spec deltas with `skip_specs: true`.

## Impact

- Example architecture content and any authored Archify input/source manifest.
- Engineering portal build output and static reader publication paths established by issue #78.
- Playwright E2E coverage and the existing GitHub Actions report/trace artifacts.
- Tracked review captures under `docs/delivery/issue-80/evidence/`.
- No product-model edits, new renderer, runtime service, package dependency, or Cloudflare production activation.

### Product definition assessment

This delivery depends on `FR-ARC42-DOCUMENTATION`, `FR-READER-VIEW`, `QR-READER-COMPREHENSION`, and `CON-ARC42-FRAMEWORK`. `UC-PUBLISH-ARCHITECTURE-VIEW` and `UC-READ-ARCHITECTURE` were checked as neighboring user goals; this issue supplies sample content in the existing read/publish flow and does not change either use case. `BR-PRODUCT-DEFINITION-AUTHORITY` and `CON-NO-ARCSHAPE-DATA-COLLECTION` were checked as boundaries and remain satisfied: the showcase changes no canonical product facts and adds no data collection or service calls.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="UC-PUBLISH-ARCHITECTURE-VIEW" digest="sha256:9ce6cd65b911aeec3601b986283f966a0232a1c59a3534f975fff4c3abddea9c" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

### Existing decisions and dependencies

- Issue #78 provides the Astro shells and static Mermaid/Archify publication paths. Issue #80 depends on #78 merging before implementation starts.
- The existing deployment view and Pages guide remain the deployment references; production publication is outside this issue.
- Issue #67 established reader E2E checks for diagram accessibility and provenance.
- Raccord issue #363 is the evidence-publishing reference: committed screenshots are embedded in a README with exact viewport sizes, observed outcomes, and explicit evidence limits. ArcShape will use that reviewable bundle shape while keeping detailed Playwright report/trace artifacts in the linked Actions run.

### Product definition drift

None identified. No Product Change is required because this issue adds illustrative documentation and regression coverage without changing defined product behavior.
