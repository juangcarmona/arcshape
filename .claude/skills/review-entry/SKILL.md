---
name: review-entry
description: "Create one per-issue retrospective record after a change has merged: what worked, what did not, what to change next time, plus the effort figures the caller supplies. Use when closing out a loop."
metadata:
  plugin: agentic-sdlc
  author: "juangcarmona"
---

## Purpose

One responsibility: create **exactly one** dated retrospective record for a work item. Separate files keep parallel reviews of different issues from contending on a shared append-only ledger.

Use this format:

```markdown
# Review #<number>: <title>

**Date:** YYYY-MM-DD

## What worked
<reflection>

## What did not
<reflection>

## What to change next time
<reflection>

## Effort
<figures and source, or not captured>

## Amendments
<destinations, or none>
```

**This skill does not compute effort figures.** The caller runs `collect-usage` and passes the numbers in. Nothing here starts a collector, reads telemetry, or re-derives a figure.

## When to use

- At loop close-out, when `review` has drafted the reflections for a merged work item.
- When recording a retrospective for a completed work item.
- When a post-merge finding needs capturing where the team will meet it again.

## When not to use

- Measuring effort. That is `collect-usage`, whose output this skill records.
- Proposing an amendment to the Definition of Ready or Definition of Done. This skill notes that one is warranted and names where it goes; `review` proposes it and a human confirms it.
- Authoring the decision record itself. That is `adr`; put its identifier on the amendment line.

## Workflow

The caller supplies the work item identifier and a short title, the date (`YYYY-MM-DD`, defaulting to today), the three reflections (**what worked**, **what did not**, **what to change next time**), and the effort figures **and their source**. The path is `docs/reviews/issue-<number>.md`, as configured by the project lifecycle. There is one retrospective record per issue.

1. **Check the target path.** If `docs/reviews/issue-<number>.md` already exists, stop and report it; never overwrite or append to it. This prevents duplicate review work from silently colliding. *Done when:* the target is confirmed absent.
2. **Compose one record** using the format below: the item identifier and title, date, three reflections, effort figures, and amendments. *Done when:* every field is filled or explicitly marked absent.
3. **Name the effort source.** The figures line says where the numbers came from, so a reader knows what they cover. Telemetry missing means write `not captured`. **Never invent a number to fill the line**, and never round an absent figure up to a plausible one. *Done when:* every figure carries a source, or is marked `not captured`.
4. **Route what graduates.** A reflection that is a recurring, structural change to how the team works does not belong buried in prose:
   - a decision with lasting trade-offs becomes an ADR candidate, and the resulting record's identifier goes in the `Amendments` section;
   - a missing guard the process should have had is noted for hardening;
   - a gap in what the team calls ready or done is noted as a proposed amendment to their Definition of Ready or Definition of Done.

   *Done when:* each structural reflection names its destination, or the `Amendments` section reads `none`.
5. **Create the new file without replacement.** Create `docs/reviews/` if needed, then use exclusive-create semantics for the target file (for example, `open` with `wx` or shell noclobber). If creation reports that the path exists, stop and report it. *Done when:* exactly one new per-issue record exists.
6. **Report** the created record and file path to the caller. *Done when:* the caller knows what was written and where.

## Validation

- Exactly one new per-issue record was created; no existing record was modified.
- The record follows the format documented by the skill.
- Every figure carries a source, or reads `not captured`.
- Each structural reflection names its destination, or the `Amendments` section reads `none`.
- No telemetry was read and no collector was started from here.

## Common pitfalls

| Pitfall | Fix |
|---|---|
| Rewriting an existing review record | Stop if the per-issue record already exists; do not overwrite it |
| Batching several work items into one call | One entry per invocation |
| Reaching for telemetry to fill a missing figure | Figures come from the caller. `collect-usage` measures them |
| Writing a plausible number instead of `not captured` | Honest absence beats an invented figure, which corrupts every summary built on the log afterwards |
| Leaving a structural lesson as prose in the entry | It graduates to a decision record or an amendment to the team's definitions, linked from the entry |
| Proposing the amendment here | Note that one is warranted and name where it goes. `review` proposes it, a human confirms it |
| Calling another skill from here | Composition happens in the calling capability |
| Appending different issues to one shared log | Create a separate file for each issue |
