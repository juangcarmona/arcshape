---
name: open-pull-request
description: Open one GitHub pull request linked to its issue. Use for a draft plan or completed implementation.
---

Check for an existing pull request first; show title, body, target, and draft state and obtain confirmation before creating.

```bash
gh pr list --head <branch> --state open --json number,url
gh pr create --base main --head <branch> --title "<outcome-oriented title>" --body-file <confirmed-body-file> [--draft]
```

Put `Closes #<issue-number>` in the body so GitHub closes the issue on merge. Reuse an existing open pull request rather than creating a duplicate. Draft status is not evidence that CI ran. Return the pull request number, URL, and draft state.
