# Mermaid documentation with separate Archify deep dives

Date: 2026-10-30. Issue: [#117](https://github.com/juangcarmona/arcshape/issues/117). Branch: `feat/117-mermaid-first-diagrams`.

## Current product decision

Author standard Mermaid in Markdown and render it with Mermaid in the main web documentation. For compatible diagrams, generate a separate Archify page and add one discreet “Deep dive with Archify ↗” link that opens a new tab. Unsupported diagrams retain Mermaid without a misleading link. This supersedes the original proposal to replace supported Mermaid with embedded native diagrams.

One editable source remains authoritative. An upgrade or site build does not rewrite authored diagrams. Existing native fences remain supported. Native-only examples can keep local JSON sidecars with generated SVG previews.

## Execution sequence

1. **Prepare.** Start from current main in an isolated issue-linked branch. Inspect existing diagrams, product graph, reader and vendor schemas. Work sequentially without subagents.
2. **Prove the adapter.** Use the installed Mermaid parser and Dagre rather than writing a grammar/layout engine. Validate labels, identities, directions, cycles and boundaries against actual native rendering. Keep a bounded feature matrix.
3. **Change product intent.** Use ProductShape overlays and obtain human approval before applying. Both [Mermaid-first sources](../../product/changes/completed/chg-mermaid-first-diagrams/change.md) and [reader/deep-dive separation](../../product/changes/completed/chg-mermaid-reader-deep-dives/change.md) were explicitly approved and applied through ProductShape. Do not hand-edit the accepted model.
4. **Record architecture.** Maintain [ADR-0003](../../architecture/09-architecture-decisions/ADR-0003-enhance-mermaid-with-native-diagrams.md) as Proposed until architecture review. Preserve ADR-0002's history and sandbox boundary.
5. **OpenSpec propose.** Create proposal, design, delta specs and independently verifiable tasks for `mermaid-first-diagrams`. Bind them to current product artifacts with generated citations.
6. **OpenSpec apply.** Implement the increments below, check off tasks only with evidence, and preserve original Mermaid in the primary rendering.
7. **Verify.** Run focused tests during development, then the full deterministic suite, browser journeys, product/spec/citation checks, dependency audit and packed-package assurance. Capture and inspect screenshots before committing visual changes.
8. **OpenSpec sync/archive.** Merge reviewed delta requirements into the existing capability, verify citations and archive completed delivery planning.
9. **Review handoff.** Commit, push the branch and open one PR linked to #117, with the tested behavior, evidence, compatibility matrix and known limitations. Human PR/architecture review and any production publication remain explicit gates.

## Implementation increments

| Increment | Concrete work | Evidence |
| --- | --- | --- |
| Parser/layout | `mermaid-native.mjs` and isolated `mermaid-parser.mjs` worker; validate native input; reuse architecture renderer showcase routing and labels | Semantic fixtures, four orientations, decision cycles and nested-boundary rendering |
| Reader/build | Keep Mermaid SVG slots unchanged; publish optional native pages separately; append a safe new-tab link; preserve original source beside the deep dive | Mixed-source order, no Mermaid replacement iframe, source equality, dedicated selection and theme |
| Native-only previews | Resolve paired SVG/JSON references within real docs root; reject unsafe/ambiguous paths; generate previews explicitly and check freshness | Missing/stale previews, traversal/symlink/regular-file tests, unchanged site sources |
| AI guidance | Update packaged authoring guidance and matching committed provider projections | Fresh packed consumer installation and original-source preservation |
| Dogfooding | Main context, container and sequence diagrams use Mermaid; native gallery retains ten readable families through SVG previews | English gallery, rendered diagrams, current product citations |
| Delivery | Changeset, user documentation, architecture views, browser/runtime screenshots and a LAN preview | Reviewable PR and recorded checks |

## Publication commands

```sh
arcshape site build --out docs/architecture-site/index.html
arcshape site build --format interactive --out docs/architecture-interactive
arcshape site build --format interactive --archify-deep-dives off --out docs/without-deep-dives
arcshape site previews
arcshape site previews --check
```

Snapshot builds render Mermaid without separate Archify pages. Interactive folder builds attempt compatible deep dives unless disabled. A valid unsupported construct receives a located diagnostic and no Archify link; malformed sources and unexpected conversion/render errors fail rather than silently substituting another engine.

## Initial deep-dive coverage

Support flowchart/graph directions TB/TD/LR/BT/RL, plain rectangle/rounded/decision nodes, quoted two-line labels, normal/dashed/thick directed relationships, labels, cycles and representable subgraphs. Native decision cards communicate the decision without requiring a literal diamond.

Bound conversion to 100 nodes, 200 relationships, 20 boundaries and 90 characters per label line. Styling, click/configuration directives, HTML/Markdown labels, self-loops, boundary endpoints, unsupported shapes, sequence fragments and other families have no derived deep dive in this increment. The main reader always renders valid Mermaid, regardless of this matrix.

## Acceptance

- A1: Mermaid renders in Markdown-capable readers and in the main generated web page.
- A2: A compatible diagram gains one separate, faithful Archify page; its elements, labels, directions, ordering and boundaries survive.
- A3: Valid unsupported syntax stays Mermaid without a dead or misleading Archify link.
- A4: Invalid input and unexpected rendering failures have actionable source locations.
- A5: Mixed Mermaid, native-only previews and legacy native fences retain order, accessible names and compatibility.
- A6: Disabling deep dives leaves Mermaid unchanged and omits derived pages.
- A7: The dedicated viewer supports keyboard selection and isolation; its new-tab link preserves appearance. The main Mermaid figure adds no inner document scrollbar.
- A8: Self-contained snapshots and no-JavaScript output show readable static diagrams without network access.
- A9: Native-only Markdown displays local SVG; missing/stale previews fail the explicit check and build.
- A10: Unsafe paths, labels and forged messages cannot escape existing trust boundaries.
- A11: Rebuilds do not modify sources; an unrelated clean tarball installation supports both authoring paths.
- A12: AI guidance uses Mermaid first; engineering documentation stays English and unsupported semantics are preserved.

## Verification and continuation

Read [progress](progress.md) for actual results and remaining work. Run the repository's current scripts/workflows, not cached commands. Use `TMPDIR=/var/tmp` on this host while /tmp is out of inodes. The review preview is http://192.168.0.3:4180/ for the same LAN/VPN.

A continuing model should read this plan, progress and the selected OpenSpec artifacts, then execute the exact next incomplete task without launching subagents. Preserve Mermaid in the main reader, derive Archify pages only as an additional view, and never infer merge/release authority from technical verification.
