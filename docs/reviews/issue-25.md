# Review #25: Ship ArcShape v1 as an installable architecture-documentation package and prove it in ArcShape

**Date:** 2026-10-17

## What worked

The linked child issues delivered the CLI, Codex and Claude workflows, evidence-based architecture authoring, the reader site, documentation integrations, and ArcShape dogfooding as separate, reviewable changes. The initial package is available from npm, and `@arcshape/cli@0.1.1` was published through GitHub Trusted Publishing with OIDC and provenance. The product definition now records the accepted scope, and release procedures are documented.

## What did not

The umbrella progress section lagged behind the child work and still described #12 and the Product Change as incomplete after both had been resolved. The first automated release also published successfully but reported failure because its final registry check queried the retired unscoped package name; that verifier was corrected and the release evidence is now captured under #12.

## What to change next time

Update umbrella progress and its child checklist as linked work closes, then reconcile the full list before closing the umbrella. Verify registry checks use the package name declared by the package manifest before relying on them after an immutable publish.

## Effort

Not captured. No configured agent telemetry or session-to-issue mapping was available.

## Amendments

None. The release verifier correction and release evidence are recorded in the linked #12 work.
