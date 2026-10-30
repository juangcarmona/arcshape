# Issue #117 execution

Branch: `feat/117-mermaid-first-diagrams`. Base: `39cc95b`. Work proceeded in one session without subagents.

## Decisions and evidence

- The maintainer explicitly approved CHG-MERMAID-FIRST-DIAGRAMS and its application in this conversation. ProductShape applied four modified artifacts and archived the change as completed; overlay validation had zero errors/warnings. This is separate from PR acceptance.
- The maintainer subsequently approved CHG-MERMAID-READER-DEEP-DIVES and its application. This supersedes the initial inline-conversion design: Mermaid stays in the reader; compatible diagrams gain a separate Archify page via “Deep dive with Archify”. Unsupported diagrams have no dead link. Both Product Changes are completed.
- Stage 0 verified Mermaid 12.2.0 flow database extraction and Dagre layout. Use the existing architecture renderer: workflow's column limit cannot preserve general graph orientations. Its showcase profile supplies automatic label placement and routing; early cycle fixtures caught real label collisions before that profile was selected.
- Parser setup needs an isolated DOM because Mermaid and the reader share DOMPurify. A bounded Node worker thread isolates deterministic parsing. This is not a delegated AI agent.
- Initial coverage includes normal/dashed/thick directed edges, cycles, orientations, quoted two-line labels and representable nested boundaries. Labels become native title/detail lines to avoid unnecessarily wide cards.
- ADR-0003 remains Proposed for architecture review. ADR-0002's history/status are preserved.
- Context/containers now use Mermaid; sequences retain Mermaid. Ten gallery families use local sidecars and committed generated SVG previews. Existing native fences still have regression coverage.
- The packaged skill source and committed Codex/Claude projections are updated. The provider updater correctly preserved files lacking ownership records; only known diagram instructions were reconciled, and unrelated legacy files were retained.
- Host `/tmp` is out of inodes. Verification uses `TMPDIR=/var/tmp`; no unrelated temporary files were removed.

## Verification completed locally

`TMPDIR=/var/tmp GITHUB_ACTIONS=true npm run verify` passed: formatting, lint, typecheck, 174 tests across 31 files, and helper-script build. Tests include clean tarball installation, source immutability, preview freshness/confinement, legacy native diagrams, and both output formats.

`TMPDIR=/var/tmp GITHUB_ACTIONS=true CI=true npm run test:e2e -- --workers=1` passed all 14 browser journeys in 2.7 minutes. Coverage includes Mermaid primary rendering, separate Archify navigation, unsupported types, opt-out/snapshot behavior, native compatibility, onboarding and both sites. An earlier run exhausted the original 180-second global budget. The expanded suite now has a 300-second global budget within the existing twelve-minute CI job; individual test assertions and timeouts remain unchanged.

Security audit passed with no unexcepted High/Critical findings. A runtime SBOM was generated from the packed package with npm 10.9.9; license policy passed for 248 components using the existing five exact-version exceptions. No exception was added.

Product model checks passed for 37 accepted artifacts. OpenSpec validation passed all ten items before archive and all nine remaining active items afterward, with no errors (two requirement-length warnings). Product citation verification reported 204 current citations across 30 documents before archive, with no stale, tampered or unresolved citations. Architecture validation and both site verification builds passed. CodeQL, secret scanning, the cross-platform matrix and passive DAST still require current-head CI evidence; local success does not stand in for them.

## Visual evidence

The PNGs in [evidence](evidence/) were captured and inspected before the implementation commit, from the working tree based on `820e6a2` (not a clean final-head build): context and containers in light mode, sequence, context in dark mode, context on a 390px mobile viewport, and the separate Archify Blueprint page. The main figures remain Mermaid; no native viewer replaces them. Wide mobile diagrams still need the separate zoomable page for detailed reading.

The LAN preview is served at http://192.168.0.3:4180/ for the maintainer on the same network. It is a development preview, not production.

## Next

The reviewed OpenSpec delta is synchronized into the main specification; all seven tasks are complete and the delivery slice is archived under `openspec/changes/archive/2026-10-30-mermaid-first-diagrams`. Open the reviewable PR. Human review of the implementation, architecture decision and residual limitations remains required before merge; release and production deployment are not claimed.
