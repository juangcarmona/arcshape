# Review #109: Interactive architecture diagrams

**Date:** 2026-10-27

## What worked

The independent review caught a real touch-panning defect that mouse tests and a narrow-screen screenshot missed. A browser touch regression reproduced `pointercancel` before the fix and now checks zoomed panning plus ordinary article swiping. The final implementation head passed its checks and independent audit; Mermaid and static output remained available. The subsequent CodeQL repair in [#112](https://github.com/juangcarmona/arcshape/issues/112) cleared the three main-branch alerts without weakening the SAST threshold.

## What did not

CodeQL passed on [PR #110](https://github.com/juangcarmona/arcshape/pull/110) but the merged-main run reported three High `js/remote-property-injection` findings in native viewer URL construction. The original FF cycle could not be called complete at merge. The retained touch screenshot also used a temporary fixture without a revision badge, so its provenance needed separate source and browser checks. Main-branch CodeQL, CI, Security, Assurance and portal checks passed after [PR #113](https://github.com/juangcarmona/arcshape/pull/113); alerts 76–78 are fixed. The version PR was prepared, but stable npm publication was skipped.

## What to change next time

Keep real touch input in the browser suite and treat post-merge main checks as acceptance evidence, especially when a PR analysis differs from main. Preserve the CodeQL SARIF rule/severity adapter regression added during this cycle. Better screenshot provenance would help reviewers, but no new mandatory gate is proposed on this evidence alone.

## Effort

Not captured. ArcShape has no configured agent telemetry or session-to-issue mapping; no time, cost or token figures were estimated.

## Amendments

The touch regression and SARIF adapter guard were implemented in the delivery PR. The URL-construction finding was corrected in #112. No lifecycle-policy amendment is proposed.
