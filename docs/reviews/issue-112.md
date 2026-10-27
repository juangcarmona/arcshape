# Review #112: Fix post-merge CodeQL URL parameter findings

**Date:** 2026-10-27

## What worked

The main-branch CodeQL failure supplied exact paths and lines. The follow-up changed only URL parameter construction, preserved selection behavior, and passed 148 local tests, ten browser journeys, the PR checks, and the independent technical review. CodeQL passed on corrected main commit `f0c7819`; alerts 76–78 are fixed.

## What did not

The three High findings appeared only after #109 merged, despite a green PR CodeQL run. This delayed completion of the original FF cycle and required a separate issue and PR.

## What to change next time

Check the main-branch security result before marking a merged cycle complete. Keep the narrow `URLSearchParams.set()` pattern for validated dynamic parameter names. No additional code or policy change is warranted after the main-branch confirmation.

## Effort

Not captured. ArcShape has no configured agent telemetry or session-to-issue mapping.

## Amendments

None. The code fix and main-branch verification are recorded in [PR #113](https://github.com/juangcarmona/arcshape/pull/113).
