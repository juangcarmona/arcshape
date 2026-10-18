# Review #63: Section-specific arc42 guidance

**Date:** 2026-10-18

## What worked

The package concern was caught before merge. Removing bundled image binaries while retaining upstream links kept the package at 242 files and about 629 KB unpacked, and the ADR template is included. The change provides section guidance for all twelve arc42 sections while keeping details selectively readable. The OpenSpec deltas were synced, validated, and archived before merge. CI and the Pages deployment both passed on merge commit `7b39bb6`.

## What did not

The integration skills disagreed with the adopted lifecycle. The lifecycle names the repository maintainer as the human reviewer and intentionally requires zero GitHub approvals, but `inspect-pull-request` treated an empty GitHub review decision as no approval and `integrate` made approval a hard gate. I initially blocked integration even after the maintainer explicitly approved in conversation, so the maintainer had to repeat the approval. The stage labels also communicate lifecycle progress without communicating the approval decision, which added to the confusion. Effort data is unavailable because this project has no configured agent telemetry or session-to-issue mapping.

## What to change next time

Reconcile the source `inspect-pull-request` and `integrate` skills with the single-maintainer policy: report GitHub review state accurately, but accept an explicit approval from the configured human reviewer when GitHub approval count is intentionally zero. Separately refine the issue status model so lifecycle stage and approval are clear, considering the maintainer's suggested `status:approved` vocabulary and relevant Agentic SDLC examples before changing labels.

## Effort

Not captured. No configured agent telemetry or session-to-issue mapping was available.

## Amendments

Updated `.agents/skills/inspect-pull-request/SKILL.md`, `.agents/skills/integrate/SKILL.md`, and `.agents/skills/merge-pull-request/SKILL.md` to distinguish GitHub review votes from explicit maintainer approval when the configured policy requires zero GitHub approvals. Follow-up: explore the stage/status label model as a separate lifecycle change; no label or lifecycle policy was changed in this review.
