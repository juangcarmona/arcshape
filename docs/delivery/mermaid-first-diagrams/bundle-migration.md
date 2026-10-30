# Native bundle migration on Bastion

The maintainer approved CHG-NATIVE-DIAGRAM-BUNDLES and explicitly selected standard `.md` companions with fenced Mermaid. ProductShape applied the five model modifications. Work stayed on `feat/117-mermaid-first-diagrams`, without subagents. Merge and publication remain pending human review.

## Files migrated

| Owning section | Native JSON | SVG | Mermaid Markdown |
| --- | ---: | ---: | ---: |
| 03 Context | 1 | 1 | 1 |
| 05 Building blocks | 1 | 1 | 1 |
| 06 Runtime | 2 | 2 | 2 |
| 07 Deployment | 1 | 1 | 1 |
| 08 Gallery | 10 | 10 | 10 |
| Total | 15 | 15 | 15 |

The [inventory](evidence/bundles/inventory.json) lists all 45 files and their hashes. The main architecture documents contain SVG/native-source pairs, not inline Mermaid. Initialization uses an activity view preserving its loop, checks and three mutually exclusive per-file outcomes. Deployment and initialization layouts were inspected and reorganized for readable compact publication. The pre-existing standalone portal illustration and its pinned historical provenance are unchanged; it is separate from these canonical architecture figures.

`arcshape site diagrams` explicitly generates the SVG and standard fenced Mermaid Markdown from native JSON. `--check` verifies all companions. Generated source/content hashes reject stale assets and edited outputs. Literal authored Markdown remains an ordinary supporting page; generated companion-only Markdown does not create duplicate navigation. Existing SVG-only `site previews` workflows stay usable when Mermaid export is unavailable; already bundled diagrams keep coordinated checking.

Mermaid sequence exports retain ordered messages and notes. Other supported families use semantic flowcharts retaining structure, cardinalities, fields, timing and annotations; this is not identical native styling or universal lossless export. Unsupported cases fail explicitly. Native JSON stays authoritative.

## Verification

- Full deterministic verification passed 197 tests across 32 files plus format, lint, typecheck and build; it includes packed installation, legacy previews, stale/modified companions, authored files, duplicate navigation, and dangling-symlink protection.
- Full browser E2E passed all 14 journeys. The deployment test was updated to copy and check the complete bundle, verify the accessible native image at narrow width, preserve all three files and exclude duplicate navigation.
- Explicit bundle checking passed for all 15 diagrams. Generation validates the Mermaid syntax before writing the companions.
- Browser inspection confirmed native widget counts 1 / 1 / 2 / 1 / 10 in sections 03 / 05 / 06 / 07 / 08 gallery, with zero Mermaid figures on those pages.
- Product model and current architecture/OpenSpec citations validate. Requirement-length warnings are informational, not suppressed.

## Runtime and screenshots

The development reader is served at http://192.168.0.3:4180/ for the same LAN/VPN. Direct review routes include [runtime](http://192.168.0.3:4180/index.html#/section/06), [deployment](http://192.168.0.3:4180/index.html#/section/07) and [gallery](http://192.168.0.3:4180/index.html#/section/08/diagram-gallery).

Screenshots in [evidence/bundles](evidence/bundles/) were captured and inspected before commit from a working tree based on `95195af`. The displayed revision identifies that base, not a clean final-head claim. Desktop, mobile, light/dark, selection and full-page views are included. A first tall deployment layout was rejected visually and replaced with a compact layout; native label validation also caught and prevented publishing an overflowing report label.

This is not production deployment or npm publication. Current-head remote security, matrix and assurance evidence remains a separate PR gate. No independent agent audit was launched because the maintainer explicitly prohibits additional agents; human judgement remains required.
