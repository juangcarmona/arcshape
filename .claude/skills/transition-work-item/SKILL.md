---
name: transition-work-item
description: Apply one confirmed GitHub issue state or lifecycle-label transition. Use only when a lifecycle stage explicitly requires a transition.
---

GitHub issue state remains `OPEN` or `CLOSED`; `stage:*` labels record the separate lifecycle stage. Read the current issue state and labels immediately before acting. Show the current and target states or labels and obtain confirmation before applying. Preserve every non-stage label and never leave more than one `stage:*` label.

```bash
gh issue close <number>
gh issue reopen <number>
gh issue edit <number> --remove-label "<current-stage-label>" --add-label "<target-stage-label>"
gh issue edit <number> --remove-label "stage:review"
```

The normal integration path closes an issue through `Closes #<number>` on a merged pull request. A confirmed lifecycle transition replaces the current `stage:*` label with exactly one target stage label. If no stage label exists or multiple stage labels are present, report the inconsistency and stop rather than guessing. After retrospective review is complete, remove `stage:review` without adding another stage label. If already closed by the merge mechanism, report the state and do not close it again. Reopening or closing outside a merged pull request is a human-only decision; never fire it on an agent's initiative. Never chain transitions.
