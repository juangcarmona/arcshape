---
name: create-branch
description: Create one issue-linked working branch from the latest origin/main.
---

Use `<type>/<issue-number>-<kebab-case-slug>` as the branch name, following the project's branch convention in `docs/engineering-lifecycle.md`. Example: `feat/47-agent-capability-distribution`. Never use a tool or agent name as the prefix. Fetch `origin` immediately before branching and use `origin/main` as the base.

```bash
git fetch origin
git switch -c <type>/<issue-number>-<kebab-case-slug> origin/main
```

If the branch already exists, report and reuse it; never recreate or force-update it. Confirm before pushing a newly created branch. Return the created branch and base.
