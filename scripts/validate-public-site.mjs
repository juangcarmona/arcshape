import { execFileSync } from "node:child_process";

// Validate the same output contract for the Cloudflare build and Pages CI.
execFileSync(process.execPath, ["scripts/verify-build.mjs"], {
  cwd: "src/public-site",
  env: { ...process.env, SITE_BASE: "/", SITE_OUT_DIR: "dist" },
  stdio: "inherit",
});
