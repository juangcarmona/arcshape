---
name: update-work-item
description: Update specified content on one GitHub issue without dropping unrelated text.
---

Read the existing issue body first, show the complete proposed body diff, and obtain human confirmation before writing.

```bash
gh issue edit <number> --body-file <confirmed-body-file>
```

Preserve every section and human-authored detail not explicitly changed. Report the fields changed and their new values. Never change issue state, clear omitted fields, or replace the body from a partial reconstruction.
