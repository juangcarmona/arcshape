# ArcShape public site source

This directory contains the static marketing site served from `arcshape.dev` by Cloudflare Pages Git integration. It is owned by ArcShape and does not import ProductShape site packages or assets.

The directory is self-contained: the project root for the Cloudflare Pages build is `src/public-site`, with no framework build command. `index.html`, `styles.css`, and `assets/` are the published output. GitHub Actions runs `node scripts/validate-public-site.mjs` on site and portal changes; it validates the same source without deploying to Cloudflare.

Keep canonical product and architecture documentation in `docs/`. Verify product claims against `docs/product/model/` when changing public copy. Generated Product and Architecture snapshots belong to the GitHub Pages build artifact, not this directory.
