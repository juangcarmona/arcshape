---
name: merge-pull-request
description: Merge one approved GitHub pull request after Done and current review/check gates pass.
---

Re-read approval, open/draft state, unresolved review threads, and current-head checks immediately before acting. Obtain explicit human confirmation before merge. Require GitHub approval when the project's lifecycle policy or branch protection requires it. When the policy intentionally requires zero GitHub approvals, the configured human reviewer must explicitly approve in the conversation; an empty GitHub review decision is not itself an approval, and labels, silence, or mergeability are never substitutes. Do not merge a draft, an unapproved change, unresolved blocking feedback, failed checks, or a change lacking the required Done evidence. No configured CI checks is not a passing check; rely on the required human review and make the missing automation explicit.

```bash
gh pr merge <number> --squash --subject "<type>(<optional-scope>): <implemented-change>" --body "Refs #<issue-number>"
```

Set the Conventional Commit subject and issue-reference body explicitly; do not accept GitHub's auto-generated squash body. Confirm the final merge result and issue closure. Never approve on the author's behalf.
