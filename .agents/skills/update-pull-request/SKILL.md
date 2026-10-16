---
name: update-pull-request
description: Update one existing GitHub pull request in place without creating a duplicate.
---

Show the proposed title/body/reviewer/draft-state diff and obtain confirmation before writing.

```bash
gh pr edit <number> --title "<title>" --body-file <confirmed-body-file>
gh pr ready <number>
```

Only perform the requested edits. Marking ready starts the review gate; do not assume that it starts CI. Never merge here or silently remove required description content.
