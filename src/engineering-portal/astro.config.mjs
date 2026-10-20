import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  base: process.env.SITE_BASE ?? "/arcshape/",
  outDir: process.env.SITE_OUT_DIR ?? "./dist",
});
