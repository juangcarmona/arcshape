# ArcShape reader site deployment

ArcShape publishes a public, self-contained architecture reader at [juangcarmona.github.io/arcshape](https://juangcarmona.github.io/arcshape/). The workflow regenerates it from `docs/architecture/`; it does not publish the checked-in snapshot or change adopters' hosting choices.

## Build and deployment

`.github/workflows/pages.yml` builds the reader site for pull requests that change its sources. Pull requests validate `_site/index.html` and do not upload a Pages artifact or deploy. Pushes to `main` build the same output and deploy it through the `github-pages` environment. A manual run can recover or refresh the site from `main`.

The workflow has repository read permission by default. Only the deploy job has `pages: write` and `id-token: write`. Its environment allows deployments from `main`; it has no secrets or human approval gate. Production deployments share one concurrency group and do not cancel an in-progress deployment. Newer queued main builds replace older pending ones. Pull request builds use separate per-PR groups and cancel stale runs.

The Pages source must be **GitHub Actions** in repository Settings → Pages. Restrict the `github-pages` environment's deployment branches to `main`. The workflow creates that environment automatically if it does not exist.

## Recovery and disable

If a deployment fails, inspect the failed step in the **Publish ArcShape reader site** workflow, fix the source or workflow, and rerun it from `main` in the Actions tab. The previously published snapshot remains available until a later deployment succeeds.

To remove the public site, open repository Settings → Pages and choose **Unpublish site**. This removes the current deployment without deleting the source Markdown or workflow. A successful deployment from `main` publishes the site again.
