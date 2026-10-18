---
name: inspect-pull-request
description: Report a GitHub pull request's current review and merge state.
---

Read the current state; a review may be stale after new commits.

```bash
gh pr view <number> --json isDraft,reviewDecision,reviews,statusCheckRollup,mergeStateStatus,url
gh api graphql -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{isResolved isOutdated path comments(first:1){nodes{body}}}}}}}' -F owner=juangcarmona -F repo=arcshape -F number=<number>
```

Report draft state, GitHub's reviewer decision, unresolved non-outdated review threads, current-head check state, and merge readiness. An empty review decision is not a GitHub approval. Read the project's lifecycle policy to determine whether GitHub approval is required: when it is intentionally zero, report that no GitHub vote exists without treating that alone as a blocker; the configured human reviewer must still explicitly approve before merge. Never infer human approval from labels, silence, or a clean merge state. Never approve, vote, resolve a thread, or report a draft as merge-ready.
