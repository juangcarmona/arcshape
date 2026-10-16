---
name: inspect-ci-result
description: Report CI evidence for the exact GitHub pull request head, distinguishing no result from pass.
---

```bash
gh pr view <number> --json headRefOid,statusCheckRollup
gh run list --commit <head-sha> --limit 10
gh api repos/juancarmona/arcshape/branches/main/protection --jq '.required_status_checks.contexts'
```

Match every run to the exact head SHA. Report passed, failed, queued, or no result separately; an empty check rollup never passes. Report the exact configured required checks. A `403` when reading branch protection means protection is unverified, not enabled or disabled. This repository currently has no configured CI workflow or known required checks, so there is no CI pass to report.

Never rerun or cancel a workflow in this read-only role.
