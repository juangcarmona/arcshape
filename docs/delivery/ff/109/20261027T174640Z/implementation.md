# Implementation evidence — issue 109

Implementation checkpoint, not Done approval. Screenshots were generated and inspected before committing. Their badge is the planning HEAD `8552f1e`; the rendered source includes the uncommitted implementation recorded alongside this file.

## Delivered behavior

Ten pinned native families render from Markdown JSON. The default single-file snapshot contains static SVG; explicit interactive output provides compact sandboxed viewers and dedicated pages, preserved focus/theme and a fixed sanitized SVG download. Mermaid remains supported in mixed documents. ArcShape's initialization sequence retains Mermaid loop/alternative semantics; context, containers and build sequence use native diagrams.

Packaged skills include authoring examples and opt-in migration guidance. Install/update does not authorize conversion. Input limits, schema/relationship validation, render deadlines, network-blocked export, sandbox/CSP isolation and owned-output publication are implemented.

## Verification

Linux, Node 22.22.1, npm 9.2.0. Security audit and packed-install SBOM use npm 10.9.9, matching security CI. Browser commands use the repository's existing `GITHUB_ACTIONS=true` launch configuration.

| Check | Observed result |
| --- | --- |
| `npm run verify` | Format, lint, typecheck, 142 tests in 27 files and helper build passed. Includes ten native tests and the packed-install smoke test. |
| Public site verify, `SITE_BASE=/` | Passed build/output tests. |
| Engineering portal build, `SITE_BASE=/arcshape/` | Passed. |
| Product model | 37 artifacts; zero errors/warnings. |
| OpenSpec validate all | 9 items passed. |
| ArcShape validation | 12 sections; no diagnostics. |
| Architecture citations | Current; no stale/tampered/unresolved references. |
| OpenSpec citations | All 29 current documents classified; zero errors. Six archived stale citations remain historical warnings. |
| Dependency audit | No unexcepted High/Critical vulnerabilities. |
| Packed CycloneDX/license policy | 248 components including MIT vendor subset; passed with five pre-existing exact-version exceptions, no policy relaxation. |
| ZAP reader and direct viewer scans | Both severity adapters passed; each report has zero High, four Medium, six Low and three Informational categories. |

The final full browser suite passed all nine journeys in 1.7 minutes, including both native journeys, pointer panning and routing cleanup. Both final quality and browser commands exited 0.

Browser coverage includes keyboard focus/reset, zoom, document-wheel scrolling, subpath hosting, theme/focus links, no opener, SVG download, 390px layout, invalid-source rollback, no overwrite on reinitialization, parent/storage denial, source-bound messages, disabled-script and failed-frame fallbacks, and CSP network blocking.

Windows/macOS, Node 24, secret scan and CodeQL are not implied by local results. Inspect those checks on the pushed implementation head.

## Screenshots inspected before commit

- [Embedded containers](screenshots/arcshape-building-blocks.png): article-width diagram, six nodes and repository boundary; bounded viewport with zoom controls and one link.
- [Dedicated viewer](screenshots/arcshape-dedicated.png): retained CLI focus, semantic relationship panel and Blueprint navigation.
- [390px layout](screenshots/arcshape-native-narrow.png): no width overflow or inner vertical scrolling. Overview labels are small; use explicit zoom/pan or the dedicated page for detail.

Context, embedded focus and dark appearance were also inspected. Reproduce via the repository's `capture-evidence.mjs` against the separate interactive preview.

## Deviations and limitations requiring review

- Node filesystem permission confinement conflicts with upstream ancestor-path inspection. The renderer is trusted package code, not an OS-sandboxed plugin. Validated input, fixed staging paths, minimal environment, memory/time bounds and browser network blocking remain enforced. Design and proposed ADR-0002 disclose this deviation.
- Only prebuilt sanitized SVG downloads are exposed, not upstream PNG/video/HTML exports or a capture of current theme/selection.
- ZAP Medium findings concern absent HTTP CSP/anti-framing headers, a CSP directive without fallback and inline styles. Low findings concern hosting isolation/permissions/content-type headers and Python server disclosure. Static output provides meta CSP, not HTTP hosting headers. These are recorded findings, not suppressions or a claim of zero vulnerabilities.
- Native coverage is family-level, not full Mermaid syntax parity. No automatic conversion or Confluence/Obsidian image upload is delivered.
- Vendoring adds package size and a pinned DOM/API dependency; hashes, attribution and SBOM coverage are checked.

## Process finding

The previous assurance pipeline scanned only the static snapshot, so a pass could miss the executable viewer. The single guard owner is `.github/workflows/assurance.yml`: it now builds interactive output and scans both the reader and a directly navigated viewer. Counterfactual: snapshot-only output cannot supply the now-required native path/report. No lifecycle-policy relaxation was made.

Local test-authoring failures concerned fixture frontmatter, ambiguous selectors and reset semantics. Tests were corrected and full suites rerun; no separate process guard is warranted for those one-off mistakes.

## Outstanding gates

Independent Done audit; acceptance of ADR-0002 and residual risks; final human review; required CI on the pushed head. No new agent without explicit agreement. No merge or publication is claimed.
