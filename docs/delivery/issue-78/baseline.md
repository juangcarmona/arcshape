# Issue #78 site baseline

Captured from plan revision `2a2f35c5299b1117fa316d13fc4a027f54a8c462` on 2026-10-19 before the Astro migration. The route manifest is `route-manifest.json`. Desktop, tablet, and phone screenshots are in `baseline/`.

## Public site

- One English route: `/`. Its in-page destinations are `#top`, `#workflow`, and `#artifacts`.
- Navigation links to Workflow, Artifacts, and the engineering portal. CTA/footer links also reach the ArcShape repository and architecture snapshot.
- No locale switch or theme control exists. The current page uses a light palette, Segoe UI body text, Avenir Next/Avenir display stack, and a 1240 px content maximum.
- Responsive behavior is CSS-only. The two-column hero and orbit illustration collapse at 900 px; workflow cards collapse to one column at 720 px. The hero orbit is hidden below 460 px.
- Brand assets are limited to `src/public-site/assets/arcshape-lockup.png` and CSS-built artwork.

## Engineering portal

- Portal routes are `/arcshape/`, `/arcshape/model/`, `/arcshape/architecture/`, and the conditional `/arcshape/e2e/latest/` allowlisted report.
- Architecture reader deep links use `/arcshape/architecture/#/section/<section-id>`.
- The engineering shell is a separate one-column light page with a 980 px maximum and a 620 px cards/header breakpoint. It has no theme control.
- `scripts/build-engineering-portal.mjs` assembles a source-SHA-stamped shell, an allowlisted E2E summary, and the separately generated Product and Architecture snapshots. The Pages workflow uploads only `_site`.

## Scope discrepancy found before implementation

The reviewed issue and plan describe existing English/Spanish route parity and existing appearance controls. The checked-out pre-migration public source contains only the English `/` route and no appearance control; the engineering shell also has no theme control. This baseline is authoritative for preservation. The implementation will retain these current routes and appearance behaviors, add a Spanish counterpart through the shared locale model, and will not invent theme controls as part of an engine migration. The plan artifacts need to state this correction explicitly before locale implementation.

## Captures

| Site | Desktop 1440x1000 | Tablet 768x1024 | Phone 390x844 |
| --- | --- | --- | --- |
| Public | `public-desktop.png` | `public-tablet.png` | `public-phone.png` |
| Engineering | `engineering-desktop.png` | `engineering-tablet.png` | `engineering-phone.png` |

## Build and deployment contracts

- Public Cloudflare project root is `src/public-site`; before this migration it publishes source files directly with no build command. `scripts/validate-public-site.mjs` checks that same source in CI, but does not deploy. The agreed migration contract changes this to `npm run build` producing `src/public-site/dist/`.
- Engineering's `.github/workflows/pages.yml` generates the Product snapshot with `npx --no-install prodshape graph --format html`, stamps it using `scripts/add-source-provenance.mjs`, generates the Architecture snapshot with `arcshape site build --source-ref`, then runs `scripts/build-engineering-portal.mjs --out _site`. The shell embeds `SOURCE_SHA`; the build verifies snapshot provenance and required routes before uploading only `_site` to GitHub Pages.
- The engineering workflow conditionally carries only the four-field public E2E summary allowlist (`run_id`, `source_commit`, `completed_at`, `result`). The raw report and trace remain in Actions artifacts.
- Public and engineering builds have no shared generated output. Cloudflare Git integration owns the public publication; GitHub Pages Actions owns the engineering publication. Cloudflare dashboard settings and an actual Cloudflare preview are external to this repository and remain unverified at baseline.
