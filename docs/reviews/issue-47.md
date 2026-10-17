# Review #47: Separate ArcShape CLI distribution from agent integrations

**Date:** 2026-10-17

## What worked

The implementation stayed aligned with the canonical ProductShape decision and OpenSpec delivery slice. The independent Done audit and the local package smoke test found no remaining blockers after fixes. The merged `main` pipeline passed its complete Node 22/24 and Ubuntu/macOS/Windows quality matrix, Product model validation, security scans, and reader-site deployment.

## What did not

The first CI attempts exposed portability and package-output assumptions: Windows executable resolution differed from POSIX, and npm 10.9.9 included lifecycle output alongside `npm pack --json`. These failures delayed the final green run but were caught before merge and fixed in the same work item. No post-merge regression was observed.

## What to change next time

Keep packed-package smoke tests on every supported operating system, and exercise the pinned npm version used in CI when parsing npm command output. The existing cross-platform matrix caught both issues before merge, so no additional process guard is warranted from this cycle.

## Effort

Not captured. The project has no configured agent telemetry or session-to-issue mapping.

## Amendments

None.
