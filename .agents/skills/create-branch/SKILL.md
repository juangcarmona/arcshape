---
name: create-branch
description: Create one issue-linked working branch from the latest origin/main.
---

Use `codex/<issue-number>-<short-slug>` as the branch name, carrying the GitHub issue number. Fetch `origin` immediately before branching and use `origin/main` as the base.

```bash
git fetch origin
git switch -c codex/<issue-number>-<short-slug> origin/main
```

If the branch already exists, report and reuse it; never recreate or force-update it. Confirm before pushing a newly created branch. Return the created branch and base.
