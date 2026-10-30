# Diagram delivery record

Date: 2026-10-30. Issue: [#117](https://github.com/juangcarmona/arcshape/issues/117). Branch: `feat/117-mermaid-first-diagrams`. PR: [#118](https://github.com/juangcarmona/arcshape/pull/118).

## Current implementation

The maintainer subsequently approved CHG-NATIVE-DIAGRAM-BUNDLES and standard fenced Mermaid `.md` companions. That contract is applied: 15 canonical architecture/gallery bundles now contain JSON, SVG and Markdown. See [bundle migration](bundle-migration.md) for the current inventory, runtime proof and verification. The `native-diagram-bundles` slice is synchronized and archived; review remains pending. The Mermaid compatibility path below remains supported, but it is no longer the default authoring contract.

## Previous product decision and plan

The maintainer approved and applied [CHG-MERMAID-NATIVE-PUBLICATION](../../product/changes/completed/chg-mermaid-native-publication/change.md). Author standard Mermaid in Markdown. Generate native diagrams in the reader wherever the entire diagram can be converted faithfully; retain full Mermaid otherwise. This replaces the earlier Mermaid-primary/deep-dive-only decision. The earlier execution record remains in progress.md and the archived first delivery slice.

One editable source stays authoritative. A build or package upgrade never rewrites authored diagrams. Existing native fences and native-only JSON sidecars with generated SVG previews remain supported.

## Execution sequence

1. Apply the approved Product Change through ProductShape; never edit canonical product artifacts directly.
2. Implement the `mermaid-native-publication` OpenSpec slice: reuse the bounded parser, Dagre layout and native pipeline; add conservative simple sequence conversion.
3. Replace supported Mermaid with native input only in memory. Self-contained HTML embeds static native SVG. Interactive folder publication embeds the existing sandboxed compact widget and provides dedicated pages plus original Mermaid exports.
4. Keep the complete Mermaid for unsupported features. An explicit `--diagram-engine mermaid` presentation rollback remains available; the previous off option remains a compatibility alias.
5. Update architecture, proposed ADR-0003, AI authoring guidance and current product citations.
6. Run deterministic, packed-install and browser checks. Capture and inspect the actual native reader before commit; preserve English engineering documentation.
7. Synchronize the delta and archive the completed slice. Update the same PR with evidence and limits.
8. Obtain human implementation/architecture approval, merge through protected checks, then use the reviewed Changesets Version Packages and protected npm-publish workflow. Verify npm, tag and release evidence independently.

## Conversion boundary

Flowchart support: TB/TD/LR/BT/RL, plain rectangle/rounded/decision nodes, quoted two-line labels, normal/dashed/thick directed relationships, labels, cycles and representable subgraphs. Limits: 100 nodes, 200 relationships, 20 boundaries, 90 plain characters per label line. Decision cards use a decision tag.

Simple sequence support: 2–12 plain participants with aliases, 1–100 ordered messages and solid/dashed filled arrows (`->>` / `-->>`). Unsupported actors, fragments, notes, activations, boxes, self-calls, numbering, async/open/cross arrows and creation/destruction remain complete Mermaid. Participant colors do not infer architectural roles.

Native renderer coverage is broader than Mermaid conversion coverage. Do not advertise every native gallery family as convertible from Mermaid.

## Acceptance

- Mermaid-capable Markdown viewers still see the canonical Mermaid sources.
- Compatible diagrams appear once as native SVG in snapshots or native widgets in folder output.
- Unsupported diagrams retain all original semantics in Mermaid.
- Labels, identities, ordering, direction, branches and boundaries are preserved or the entire conversion is declined.
- Invalid sources and renderer failures stop publication with source location.
- Original Mermaid is available beside generated dedicated pages.
- Mermaid-only mode, legacy native fences, sidecars, preview freshness, source immutability and output ownership remain tested.
- Browser evidence covers selection, isolation, full-page navigation, normal outer scrolling, light/dark and 390px mobile.
- Offline/no-JavaScript output remains readable without network resources.
- AI guidance, product intent, architecture and specifications describe the same behavior.

## Verification and continuation

Read [progress](progress.md) and the latest selected OpenSpec slice for actual results. Use current scripts/workflows, not cached commands. Verification used `TMPDIR=/var/tmp` because the default temporary directory lacked available inodes. Preview reproduction instructions are in [bundle migration](bundle-migration.md).

Continue sequentially without subagents. Human product approval is recorded; implementation review, merge acceptance and protected release approval remain separate gates.
