# Cloudflare preview verification

Issue #78 requires a real pull-request preview and the actual Cloudflare Pages dashboard root, build, output, preview, production-branch, and custom-domain settings.

The repository now defines and locally validates the expected Git integration contract: root `src/public-site`, build command `npm run build`, static output `dist`, and pull-request preview deployments. The workflow builds the public Astro output but does not contain Cloudflare credentials or a Cloudflare deploy action.

No Cloudflare dashboard session or preview deployment is available from this checkout. Therefore there is no verified preview URL and no dashboard value is asserted here. This task remains open until a maintainer can inspect the project settings and preview deployment. Keep production publishing and `arcshape.dev` domain binding disabled until that preview is reviewed and activation is authorized.
