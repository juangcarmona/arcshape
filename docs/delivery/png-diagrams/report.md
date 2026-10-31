# Portable PNG diagram delivery

Issue: [#120](https://github.com/juangcarmona/arcshape/issues/120). Base: `a8310cd` (0.3.0). Branch: `feat/120-portable-png-diagrams`.

## Authority and outcome

The maintainer approved PNG as the general Markdown default and requested continuation through the npm publication step: “Vale, adelante. Sigue, no pares hasta el paso de npm publish. Aprueba todo por mi”. That is recorded as the maintainer's authorization, not an agent-authored forge approval. No additional agents were launched; this is not an independently audited Fast Forward run. Required checks, branch rules and protected environments remain binding.

CHG-PORTABLE-PNG-DIAGRAMS validated and was explicitly applied. ADR-0004 records the accepted raster/vector decision. The implementation adds PNG to the bundle without changing JSON authority, SVG quality or Mermaid alternatives. Existing SVG-only bundles stay valid. Both HTML formats retain their native presentation and ordinary builds do not rasterize or migrate authored files.

## Migration and measurements

All fifteen canonical architecture/gallery diagrams now display PNG in Markdown and retain JSON, SVG and Mermaid Markdown: sixty bundle files. The existing independently pinned standalone portal illustration remains unchanged.

The [measurement inventory](evidence/png-measurements.json) records actual dimensions, byte lengths and hashes for all fifteen PNGs. They range from 56307 to 179542 bytes; their combined size is 1308623 bytes. The deployment preview is 2380 × 1876 pixels and 179542 bytes. No new dependency was added.

PNG uses the sanitized light-theme vector rendering over an opaque background. Typical output is 2x; dimensions are capped at 8192 per axis and sixteen million pixels, with a 16 MiB file limit. Standard PNG text metadata binds source/vector/content hashes. Chunk CRCs are independently checked against Node in tests; the runtime CRC implementation preserves the existing Node 22.0 minimum. Existing dependency runtime requirements are unchanged.

## Verification

- Full `npm run verify` passed locally: 206 tests across 34 files, including two previously emitted helper tests; clean source discovery is 204 tests. Format, lint, typecheck and build passed.
- Full Playwright suite passed all fourteen journeys after the same public-site and engineering-portal prebuilds used by CI.
- Native bundle checks passed all fifteen diagrams. Product model validation passed 37 artifacts, architecture links passed, and current OpenSpec/architecture citations have no stale, tampered or unresolved payloads.
- Dependency audit passed with no unexcepted High/Critical findings. Cross-platform, secrets, CodeQL, SBOM/license and passive DAST remain the PR's current-head remote checks; local verification is not their substitute.
- Packed installation generates PNG-selected bundles and both HTML modes. Tests cover legacy three-file compatibility, missing/stale/edited PNG, source changes, malformed data, dimensions, checksums, unsafe references and dangling symlinks.

## Visual evidence

The seven PNGs under [evidence](evidence/) were captured and inspected before commit from the working tree based on `a8310cd`; their stamp identifies that base, not clean final-head evidence. They show context, containers, selection, the dedicated viewer, light/dark, mobile and navigation. The generated deployment PNG itself was inspected for light-background text and relationships. At narrow width, wide diagrams still need deliberate zoom or the dedicated page to read details.

## Failures and guards

The first E2E attempt omitted the two site builds required by CI, causing missing-dist errors in the portal/public-site journeys. README's local recipe now includes both builds; the entire suite was repeated successfully.

Adding ADR-0004 exposed a Confluence test hardcoded to seventeen documents. It now counts the actual ADR files while still asserting the index, twelve sections and gallery, creation/manifest counts and unchanged repeat sync. A future ADR addition no longer requires changing unrelated magic numbers. The full verification was repeated after this correction.

Delivery-only PR/CI/integration work is retained under OpenSpec's workflow follow-up rather than tracked as incomplete implementation. The delta was synchronized without dropping unrelated requirements and archived only after implementation verification.

## Residual limits and release boundary

No authenticated Azure DevOps environment was available; PNG portability and standard Markdown references were verified locally, not claimed as a live Azure test. Raster zoom is finite; SVG is retained. Very large diagrams may be downscaled to respect bounds. Existing external connectors do not gain automatic image upload or native interactivity.

The changeset includes an opt-in migration prompt. Integration and the Version Packages PR require current-head checks. The requested endpoint is the npm publication step or its protected human gate, not a manual workstation publish or an external account change.
