# Review #12: Publish ArcShape to npm manually once, then automate trusted GitHub releases

**Date:** 2026-10-17

## What worked

The release workflow verified the package, then published `@arcshape/cli@0.1.1` through GitHub OIDC with npm provenance. The post-publish registry check initially failed because it queried the retired unscoped package name. PR #51 corrected the verifier to read the package name from `package.json`, and its check confirmed the already-published version without republishing it. The release evidence and recovery guidance are now recorded in `docs/releasing.md`.

## What did not

The first automated publish run ended red after npm had accepted the immutable package, because the final verification step queried the wrong package name. That made the release appear unsuccessful despite a successful publish and provenance generation.

## What to change next time

Before enabling an irreversible publish step, verify that the post-publish check resolves the package identity from the same source as the publish command and exercise that check against the scoped package name. No further process amendment is proposed; PR #51 corrected the verifier.

## Effort

Not captured. No configured agent telemetry or session-to-issue mapping was available.

## Amendments

None.
