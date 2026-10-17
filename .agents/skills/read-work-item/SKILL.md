---
name: read-work-item
description: Read one GitHub issue into structured fields. Use when a lifecycle stage needs its current content or state.
---

Read-only role. Use the repository's GitHub CLI context.

```bash
gh issue view <number> --json number,title,body,state,labels,assignees,url
```

Return identifier, title, full Markdown body, `OPEN`/`CLOSED` state, labels, assignees, URL, and acceptance criteria only when explicitly present in the body. The lifecycle stage is the single matching `stage:*` label. If none or multiple exist, report the stage as missing or inconsistent; never infer it from issue state or other fields. Preserve the distinction between GitHub issue state and lifecycle stage. Do not follow links or fetch attachments. Never modify the issue.
