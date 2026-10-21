---
name: arc-adr
description: Draft and maintain Markdown Architecture Decision Records in ArcShape's section 09 collection. Use when a durable architecture trade-off needs a reviewable record.
---

# ArcShape ADR workflow

1. **Confirm decision authority.** Identify the maintainer or role authorized to decide. Repository evidence establishes current behavior and constraints, not intent or acceptance. Ask for the decision if it is unknown; do not infer it from implementation, plans, or issue text. New records stay Proposed unless the maintainer explicitly confirms acceptance.
2. **Inspect the canonical collection.** Read `docs/architecture/09-architecture-decisions/README.md`, all existing ADR files below that directory, relevant accepted ADRs, and the rest of arc42 section 09. Never create a parallel `docs/adr/` collection.
3. **Create the record in section 09.** Use `docs/architecture/09-architecture-decisions/ADR-NNNN-kebab-case-title.md` by default, with the next unique four-digit ID. Numbers only increase and are never reused. A project may group records in stable subdirectories below section 09; preserve those groups and link them from the section README. Copy [`references/template.md`](references/template.md). If the collection has no index or its convention is ambiguous, report the gap and ask before changing it.
4. **Complete the record from supplied intent and evidence.** Keep Context neutral and separate observed behavior, maintainer intent, assumptions, and unresolved questions. State the authorized decision in Decision. Include the main rejected alternatives and reasons, positive/negative/neutral consequences, and references. Remove all template guidance and placeholders.
5. **Preserve decision history.** Reverse a decision in a new ADR. Do not mark the old decision superseded until the replacement is accepted. Confirm superseding relationships with the maintainer before recording them.
6. **Update the section index.** Add every ADR, regardless of status, to `docs/architecture/09-architecture-decisions/README.md`. Keep entries sorted alphabetically by ADR title, use stable relative links, and show status and date. The index is navigation only; keep rationale and consequences in the ADR. If accepted decisions need a compact current-architecture view, keep it separate from the complete ADR list.
7. **Keep the section document canonical.** The section `README.md` carries the arc42 section frontmatter and is both the section document and ADR navigation index. ADR files and grouped supporting Markdown are supporting material owned by section 09; they must not carry `arc42-section` frontmatter or become additional arc42 sections.
8. **Present the proposal.** Show the complete diff, identify evidence and assumptions, report the file path and ID, and summarize open questions. Leave decision and documentation acceptance to the maintainer.

## Default status vocabulary

Use the repository's existing vocabulary when it has one. For the default convention, use only these values:

| Status | Meaning |
| --- | --- |
| `Proposed` | Under discussion; default for a new record. |
| `Accepted` | Explicitly agreed by the authorized maintainer and in effect. |
| `Rejected` | Considered and declined; retained for the record. |
| `Deprecated` | No longer applies and has not been replaced. |
| `Superseded by ADR-NNNN` | Replaced by a later accepted decision; link that record. |

## Validation

- The filename and frontmatter ID follow the repository convention; the default is a unique, sequential `ADR-0001-kebab-case-title.md` record.
- Frontmatter follows the repository convention; the default fields are `id`, `title`, `status`, `date`, and `deciders`. Add `supersedes` or `superseded_by` only for confirmed relationships.
- The record has Context, Decision, Alternatives considered, Consequences, and References in order, with no placeholders.
- The authorized maintainer supplied the decision and acceptance status; neither was inferred from implementation evidence.
- The section 09 README has one matching entry for every ADR, sorted alphabetically by title, or an established absence is reported.
- ADRs remain below section 09, grouped only by stable project-defined subdirectories, and supporting documents do not carry `arc42-section`.
