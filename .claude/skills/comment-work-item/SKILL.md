---
name: comment-work-item
description: Add one confirmed Markdown comment to a GitHub issue.
---

Show the exact comment and obtain human confirmation before posting. Use a body file for multi-line content.

```bash
gh issue comment <number> --body-file <confirmed-comment-file>
```

Post once. Before retrying an ambiguous operation, check whether the identical comment already exists. Never edit or delete an existing comment, and avoid redundant lifecycle noise. Return the comment URL or identifier.
