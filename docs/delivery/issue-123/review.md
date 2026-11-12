# Public-site readability and arc42 guide

Issue: [#123](https://github.com/juangcarmona/arcshape/issues/123). Repository: `juangcarmona/arcshape`, numeric ID `1421716074`. Implementation starts from `151967f7c90ee2f12c6bbb30c7d6fda661676b34` in an isolated worktree; the primary checkout’s unrelated work is preserved.

## Content and design

The approved increment covers the English public homepage and a dedicated `/arc42/` page. The latest maintainer correction replaces the AI-led headline and brand line with “Document your software architecture.” and “Engineering documentation”. AI assistance is explained in the workflow. The engineering portal, generated architecture reader, and CLI are outside the implementation scope.

The homepage replaces the orbit illustration with a readable architecture excerpt. Its Markdown source is imported during the build, so moving the output directory does not change the source lookup. The source/reader comparison shows the same passage in both forms. The primary action opens ArcShape’s published architecture, and the guide introduces arc42 without requiring prior knowledge.

The guide contains the twelve official section names and numbers, original explanations, a clearly labelled hypothetical booking-system example for each section, and links to official guidance. All twelve section URLs, the arc42 website/license, and the official examples site returned HTTP 200 during review.

Lighthouse UI `0.2.1` supplies the semantic tokens. Public-page overrides use 16px body text, 18px introductory copy, supporting text of at least 14px, and controls of at least 44px. Native menu and appearance controls retain keyboard access and saved preferences. Navigation works without JavaScript. The generated `_redirects` file retires `/es` and `/es/` with permanent redirects and respects the build’s base path.

## Wording and visual review

The Humanizer skill was applied to the page copy: repeated slogans and abstract claims were removed, supported capabilities were retained, and framework terminology is introduced on the guide page. The guide’s booking examples are explanatory examples, not product evidence.

[Taste](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md) review uses its copy checker and visual checklist for hierarchy, aligned edges, a real product subject, readable type, controls, and responsive behavior. The approved Lighthouse design determines typography, colors, and motion. Taste’s full build gate was not used: its required visual effects and fixed screen-height recipes are outside this approved design.

The [copy review](evidence/taste-copy-review.txt) reports zero failures on both pages and zero warnings on the homepage. Two guide warnings flag the section numbers as a statistics strip and numbered steps. The numbers identify the standard arc42 sections and remain intentionally visible in the navigation and content.

Fresh screenshots cover both pages at 390px and 1440px in light and dark appearance. They show a text-first mobile layout, full-width hero actions, a documentation preview, stacked workflow content, and visible guide explanations. The guide uses a sticky section index on desktop and an ordinary numbered index on mobile.

- [Original mobile homepage](evidence/before-home-390-light.png)
- [Updated mobile homepage](evidence/home-390-light.png)
- [Updated desktop homepage](evidence/home-1440-light.png)
- [Dark desktop homepage](evidence/home-1440-dark.png)
- [Mobile arc42 guide](evidence/arc42-390-light.png)
- [Desktop arc42 guide](evidence/arc42-1440-light.png)
- [Mobile menu](evidence/mobile-menu.png)
- [Mobile menu with 200% text](evidence/mobile-menu-200-percent.png)

## Verification

- `npm --prefix src/public-site run verify`: root output, both English pages, metadata, source excerpt, all guide anchors and destinations, bundled styles, assets, and redirect rules.
- `SITE_BASE=/arcshape/ SITE_OUT_DIR=./.astro/subpath-output npm --prefix src/public-site run verify`: subpath build and redirected destinations.
- `node scripts/validate-public-site.mjs`: the same root output contract used by the publication workflow.
- `npx playwright test e2e/public-site.playwright.mjs --reporter=list`: seven browser journeys, including both pages at 320, 390, 768, 900, and 1440px in light/dark appearance; contrast, font sizes, touch targets, menu focus/Escape, guide anchors, system theme changes, persisted preferences, redirects, reduced motion, JavaScript-disabled navigation, and blocked storage.
- The text-resizing test verifies that the root actually reaches 32px at 200%, with the mobile menu expanded. This caught long text overflowing the reader excerpt; wrapping and appearance-control reflow were corrected.
- `GITHUB_ACTIONS=true npm test`: 34 test files, 206 tests passed.
- Repository formatting, lint, typecheck, helper build, branch-name check, and whitespace check passed.
- `npm exec --yes --package npm@10.9.9 -- npm audit --prefix src/public-site --omit=dev --audit-level=high`: zero vulnerabilities. The environment’s older npm audit endpoint failed; the repository’s pinned npm version completed the audit.
- Cloudflare local runtime (Wrangler 4.151.3): parsed both redirect rules; `/` and `/arc42/` returned 200, while `/es` and `/es/` returned 301 with `Location: /`.

## Review boundary

The local preview is `http://192.168.0.3:4327/`, with the guide at `/arc42/`; LAN/VPN access is required. Astro preview serves the pages; Cloudflare’s local runtime on port 4328 was used to verify redirects.

Production has not been deployed. Human visual acceptance, protected CI/security checks, and any hosted preview remain separate from these local results. Browser verification used Chromium; a physical mobile device and Safari were not available for this review. Astro’s local subpath build stays on the workspace filesystem because this version uses file renames that fail across filesystem boundaries.
