---
name: read-work-item
description: Read one GitHub issue into structured fields. Use when a lifecycle stage needs its current content or state.
---

Read-only role. Use the repository's GitHub CLI context.

```bash
gh issue view <number> --json number,title,body,state,labels,assignees,url
```

Return identifier, title, full Markdown body, `OPEN`/`CLOSED` state, labels, assignees, URL, and acceptance criteria only when explicitly present in the body. Report absent data as absent; do not infer fields or lifecycle state. GitHub issue state is only open or closed. There is no project board, status field, or configured lifecycle label. Do not follow links or fetch attachments. Never modify the issue.
