# Issue #78 visual comparison

Baseline captures were taken from the approved plan revision before source changes. The post-migration captures were produced from the Astro public build and assembled engineering build on 2026-10-19.

The original `after/` captures document the Astro migration before the design-system alignment. They are retained as historical evidence and do not represent the latest styling. The additional captures under `after/theme-alignment/` show the current public, engineering, and architecture surfaces after aligning their shared compact header, typography, surface colors, controls, focus treatment, and theme-aware ArcShape branding with ProductShape. The header and footer use the original ArcShape blueprint AS lockup from `src/public-site/src/assets/arcshape-lockup-source.png`, optimized as `arcshape-lockup.webp`; the public and engineering banners say “AI driven engineering documentation.” The public Spanish route keeps its navigation and exposes Spanish appearance control names.

The captures were rendered from the built static outputs at 1440px desktop and 390px phone widths. Each was inspected; all have no document-width overflow. Light and dark appearances render the ArcShape lockup and matching surface tokens. This is implementation evidence, not maintainer visual approval.

These are local comparison captures; they do not substitute for maintainer visual acceptance. Current public and engineering route manifests are `route-manifest.after.json`; the original observed routes are retained in `route-manifest.json`.

## Theme-alignment captures

| Surface | Appearance | Viewport | Capture |
| --- | --- | --- | --- |
| Public English | Light | Desktop | `after/theme-alignment/public-desktop-light.png` |
| Public English | Dark | Desktop | `after/theme-alignment/public-desktop-dark.png` |
| Public Spanish | Light | Phone | `after/theme-alignment/public-spanish-phone.png` |
| Engineering portal | Light | Desktop | `after/theme-alignment/engineering-desktop-light.png` |
| Engineering portal | Dark | Phone | `after/theme-alignment/engineering-phone-dark.png` |
| Architecture reader | Dark | Desktop | `after/theme-alignment/architecture-desktop-dark.png` |

## Post-migration captures

| Surface | Desktop | Tablet | Phone |
| --- | --- | --- | --- |
| Public English | `after/public-desktop.png` | `after/public-tablet.png` | `after/public-phone.png` |
| Public Spanish | `after/public-es-desktop.png` | — | — |
| Engineering portal | `after/engineering-desktop.png` | `after/engineering-tablet.png` | `after/engineering-phone.png` |
