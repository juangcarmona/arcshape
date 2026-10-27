# Interactive diagrams — FF 20261027T174640Z

Issue: [#109](https://github.com/juangcarmona/arcshape/issues/109). Base: `c1e38279a6b7276ec4f606177c7e41a99d64c771`.

Draft PR: [#110](https://github.com/juangcarmona/arcshape/pull/110). Refinement artifacts: `11ad591a6bd60b9334a5745b77fbba623d9e18ac`; subsequent evidence bookkeeping does not change the reviewed product draft.

Status: blocked at the human product-approval gate. The issue remains in backlog. A draft PR shares the refinement artifacts; it is not a completed technical proposal or permission to merge. No runtime implementation or release is claimed.

## Preflight

The harness recorded executor `gpt-6-astra` and independent reviewer `gpt-6.1-sol` in distinct sessions. The configured correction limit is three per gate. The worktree preserves the running Brisa prototype and starts at fetched `origin/main`.

Independent preflight advice identified unsandboxed frames, missing input/path validation, private viewer API coupling, ambiguous source ownership, nonportable source imports, incomplete Mermaid parity, accessibility/focus risks, and distribution/license assurance needs. This is advice, not product approval or a plan review.

## Review debt

Recent merged issues #86, #88, #90, #97, #100, #102 and #105 have no per-item retrospective on the base branch. This is a nonblocking, bounded pickup check of the latest sixteen merged PRs, not a complete historical audit.

## Scope

Carry the accepted embedded interaction into supported ArcShape authoring and publication, preserve Mermaid and the self-contained reader, provide opt-in migration, and validate actual rendered diagrams before committing visual changes. This run does not authorize automatic adopter edits or production publication.

## Result and next decision

CHG-INTERACTIVE-DIAGRAMS-001 adds one general diagram-authoring use case and one interactive-diagram requirement, and proposes six changes to existing requirements and boundary relationships. All eight proposed artifacts are complete future states; their `active` values describe the requested future baseline, not present approval. The enclosing change remains `draft` and `docs/product/model` is untouched.

The independent draft review requested two corrections, now resolved: explicit parent-page isolation and preserved external-publication readability. One correction round was used. Local quality checks passed with 132 tests; product and existing OpenSpec validations passed. See [verification](verification.md) for environment differences and unproven CI/Assurance checks.

The maintainer must approve or amend the proposed product intent. Approval, explicit apply and eventual baseline acceptance remain separate. Resume the same run with `refine`, then `propose` and a fresh independent technical-plan review. Implementation, integration and retrospective have not run. Final human review and publication gates remain protected.
