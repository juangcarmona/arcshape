# ArcShape public site

This is ArcShape's independently built public product site. It uses Astro's static output; it does not import ProductShape site packages or assets and does not require an application server.

## Local build

Run these commands from `src/public-site`:

```sh
npm ci
npm run build
npm test
```

Astro writes the deployable static site to `dist/`. The English homepage is `/`; `/arc42/` explains the framework and its twelve sections with official guidance links. `npm run verify` checks both pages, metadata, Lighthouse styles, source excerpts, assets, and permanent redirects. The retired `/es` and `/es/` routes redirect to `/` through the generated Cloudflare `_redirects` file. Redirect destinations respect `SITE_BASE`.

The public site imports the pinned `@juangcarmona/lighthouse-ui` semantic tokens through Astro’s CSS bundler. Product typography uses 16px body text, 18px introductory text, 14px supporting copy, and controls of at least 44px. Light, dark, and system appearance preserve the existing `arcshape-appearance` preference. The mobile menu uses native `details` so navigation works without JavaScript.

Run `npm run preview -- --host 0.0.0.0 --port 4327` to inspect the built pages. Astro preview does not apply Cloudflare redirect rules; test those using `wrangler dev --local` or a Cloudflare preview.

The documentation excerpt is imported from the canonical architecture source at build time. The arc42 guide uses original explanations and a hypothetical booking-system example; official section numbers and links are in `src/data/site.mjs`.

The GitHub Pages workflow also builds and verifies the output at `/` and `/arcshape/`. The Cloudflare site uses `/`.

## Cloudflare Workers Builds

The Cloudflare project uses Git integration with Workers Builds. The site itself is Astro static output; the build writes files to `dist/`.

Use these settings in the Worker's Build configuration:

| Setting                | Value                                         |
| ---------------------- | --------------------------------------------- |
| Root directory         | `src/public-site`                             |
| Build command          | `npm run build`                               |
| Deploy command         | Leave blank (Workers Builds uses `npx wrangler deploy`) |
| Worker name            | `arcshape`                                    |
| Build system           | Astro static; build output is `dist/`         |
| Pull request previews  | Enable, then verify using a real pull request |

The Build configuration has no output-directory field; `dist/` is where Astro writes the built site. Leave Deploy command blank to use Workers Builds' default `npx wrangler deploy`. The checked-in `wrangler.jsonc` supplies the valid Worker name (`arcshape`) and static asset directory, so Wrangler does not enter automatic Astro setup.

The production branch is `main`; pushes there can publish production. Enable pull-request previews to review changes before merging. Keep production publishing and the `arcshape.dev` custom-domain binding disabled until the maintainer reviews a real preview and authorizes activation. Record the actual Cloudflare preview URL and dashboard settings in `docs/pages-deployment.md`; repository configuration cannot prove account state.

GitHub Actions runs `npm run verify` against the public output and separately assembles the engineering artifact. That workflow contains no Cloudflare credentials and never deploys this site.

To recover from a bad preview, fix the source and push a new pull request commit; previews follow their pull request. For an accidental production deployment, pause production builds in Cloudflare and use the dashboard's previous successful deployment for rollback, then identify the source commit before re-enabling builds. Do not bind the custom domain as part of recovery without maintainer authorization.

Product claims belong to the canonical model in `docs/product/model/`. Keep generated Product and Architecture snapshots in the separate GitHub Pages artifact.
