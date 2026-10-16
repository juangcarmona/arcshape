---
name: transition-work-item
description: Apply one confirmed GitHub issue state transition. Use only when a lifecycle stage explicitly requires a state change.
---

GitHub Issues has only `OPEN` and `CLOSED` states here; there are no status labels or Project fields. Read current state immediately before acting. Show the target and confirm before applying.

```bash
gh issue close <number>
gh issue reopen <number>
```

The normal integration path closes an issue through `Closes #<number>` on a merged pull request. If already closed by that mechanism, report the state and do nothing. Reopening or closing outside a merged pull request is a human-only decision; never fire it on an agent's initiative. Never chain transitions.
