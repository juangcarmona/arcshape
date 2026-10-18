---
name: arc-adr
description: Draft, review, and maintain Markdown Architecture Decision Records from a decision supplied by a maintainer and supporting repository evidence. Use when a durable architecture trade-off needs a record.
---

# ArcShape ADR workflow

1. Confirm the decision being made and who has authority to accept it. If the decision itself is unknown, ask; do not infer a choice from implementation alone.
2. Inspect existing ADR conventions, folders, indexes, relevant arc42 sections, and evidence. Reuse the repository's canonical folder, naming scheme, metadata, and index; never create a parallel ADR collection.
3. If no ADR convention exists, create `docs/adr/` and its `README.md` index. Name records `ADR-0001-kebab-case-title.md`, assigning the next sequential four-digit ID. Use lowercase kebab-case for descriptive path components; retain the conventional uppercase `ADR` identifier prefix.
4. Give every new ADR YAML frontmatter with `id`, `title`, `status`, `date`, and `deciders`. Add `supersedes` or `superseded_by` only when the relationship is confirmed. Draft the Markdown body with Context, Decision, Alternatives considered, Consequences, and References. Separate supplied decisions from observed facts and unresolved assumptions.
5. New records are Proposed unless the maintainer explicitly says the decision is accepted. Include rejected alternatives and why they were rejected.
6. Never rewrite history to reverse a decision. Propose a new ADR and show any superseding relationship for review. Keep the existing ADR's status until the new decision is accepted; then mark the old record superseded. Confirm the relationship with the maintainer before recording it.
7. Add every new ADR to the canonical ADR index, creating it if necessary. For an accepted decision, update arc42 section 09 when present with a concise decision, link to the canonical ADR, and affected architecture. Do not put proposed decisions in the current architecture index.
8. Show the complete diff and summarize open questions. Leave acceptance to the maintainer.

Keep the ADR and its index in Markdown. For the default convention, the index is `docs/adr/README.md`. If the repository has a different established convention, update its canonical index instead.
