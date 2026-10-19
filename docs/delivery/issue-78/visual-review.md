# Issue #78 visual comparison

Baseline captures were taken from the approved plan revision before source changes. The post-migration captures were produced from the Astro public build and assembled engineering build on 2026-10-19.

Desktop and phone side-by-side comparisons show the existing public hero, lockup, workflow sections, artifact story, color palette, typography, spacing, and responsive stacking remain visually consistent. The only public navigation addition is the required locale counterpart link. The engineering portal retains the same one-column layout and card placement. The architecture reader's existing Auto/Light/Dark controls and responsive shell were captured separately and remain in the unchanged reader shell.

These are local comparison captures; they do not substitute for maintainer visual acceptance. Current public and engineering route manifests are `route-manifest.after.json`; the original observed routes are retained in `route-manifest.json`.

## Post-migration captures

| Surface | Desktop | Tablet | Phone |
| --- | --- | --- | --- |
| Public English | `after/public-desktop.png` | `after/public-tablet.png` | `after/public-phone.png` |
| Public Spanish | `after/public-es-desktop.png` | — | — |
| Engineering portal | `after/engineering-desktop.png` | `after/engineering-tablet.png` | `after/engineering-phone.png` |
