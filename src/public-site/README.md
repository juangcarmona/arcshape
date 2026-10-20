# ArcShape public site

This is ArcShape's independently built public product site. It uses Astro's static output; it does not import ProductShape site packages or assets and does not require an application server.

## Local build

Run these commands from `src/public-site`:

```sh
npm ci
npm run build
npm test
```

Astro writes the deployable static site to `dist/`. `npm run verify` builds the site and checks both localized routes, their route-switch links, page metadata, accessibility hooks, and static output. English is `/`; Spanish is `/es/`. Add locales in `src/data/locales.mjs`; the shared landing template and validator enforce counterpart routes and complete copy.

The GitHub Pages workflow also builds and verifies the output at `/` and `/arcshape/`. The Cloudflare site uses `/`.

## Cloudflare Pages Git integration

Configure the Pages project against this repository with:

| Setting                | Value                                         |
| ---------------------- | --------------------------------------------- |
| Root directory         | `src/public-site`                             |
| Build command          | `npm run build`                               |
| Build output directory | `dist`                                        |
| Build system           | Astro static; no adapter or server runtime    |
| Pull request previews  | Enable, then verify using a real pull request |

Set the production branch to `main` only when production builds are explicitly authorized. Keep production publishing and the `arcshape.dev` custom-domain binding disabled until the maintainer reviews a real preview and authorizes activation. Record the actual Cloudflare preview URL and dashboard settings in `docs/pages-deployment.md`; repository configuration cannot prove account state.

GitHub Actions runs `npm run verify` against the public output and separately assembles the engineering artifact. That workflow contains no Cloudflare credentials and never deploys this site.

To recover from a bad preview, fix the source and push a new pull request commit; previews follow their pull request. For an accidental production deployment, pause production builds in Cloudflare and use the dashboard's previous successful deployment for rollback, then identify the source commit before re-enabling builds. Do not bind the custom domain as part of recovery without maintainer authorization.

Product claims belong to the canonical model in `docs/product/model/`. Keep generated Product and Architecture snapshots in the separate GitHub Pages artifact.
