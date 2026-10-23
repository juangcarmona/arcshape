# Issue 102 runtime evidence

Source commit: `9ff8c904a4537a04543b90bdaa4aa1e17b5df562`

## Checks exercised

- Focused reader and engineering-portal tests passed: `19` tests.
- The engineering portal built successfully and passed shell verification.
- The existing Playwright engineering-portal test passed on the desktop path.
- The generated reader built successfully; its `.doc` rule has no fixed `78ch` measure.
- The reader and portal were inspected at desktop and narrow `iPhone 13` viewports.
- The portal and generated-reader brand links expose the public-site accessible name, safe external-link attributes, and visible keyboard focus; the redundant header badge/caption is absent.
- The dependency audit passes after updating the vulnerable runtime `dompurify` package to `3.4.17` and removing stale advisory exceptions; the synthetic secret-scan gate and runtime SBOM/license-policy gate also pass.

## Screenshots

- [Portal header — desktop](portal-header-desktop.png)
- [Portal header — narrow viewport](portal-header-mobile.png)
- [Generated reader — desktop](reader-desktop.png)
- [Generated reader — narrow viewport](reader-mobile.png)

The first local browser attempt without `GITHUB_ACTIONS=true` could not launch Chromium because of the sandbox configuration. Re-running the same checks in the repository's documented CI mode passed.
