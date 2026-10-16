---
name: checkout-branch
description: Safely switch the working copy to an existing branch, fetching it when needed.
---

```bash
git status --porcelain
git fetch origin
git switch <branch>
```

Never discard or reset uncommitted work. Refuse the switch or stash only after explicit confirmation. If the branch exists only remotely, track it. If another worktree has it checked out, report that worktree and stop.
