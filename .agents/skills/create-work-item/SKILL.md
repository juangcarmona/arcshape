---
name: create-work-item
description: Create one GitHub issue from confirmed structured input. Use for a shaped idea or follow-up that needs tracking.
---

Create only one issue per invocation. Show the proposed title and complete body and obtain human confirmation before writing.

```bash
gh issue create --title "<outcome-oriented title>" --body-file <confirmed-body-file>
```

Use the general-work or bug issue-form structure when applicable. Blank issues are allowed and are intake, not Ready work. Do not invent required information, add unrequested labels, or transition the new issue. Return the issue number and URL.
