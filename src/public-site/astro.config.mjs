import { defineConfig } from "astro/config";
import { writeFile } from "node:fs/promises";

const base = process.env.SITE_BASE ?? "/";
if (!base.startsWith("/") || !base.endsWith("/"))
  throw new Error("SITE_BASE must start and end with a slash");

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  base,
  outDir: process.env.SITE_OUT_DIR ?? "./dist",
  publicDir: "./public",
  integrations: [
    {
      name: "retired-language-redirects",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          await writeFile(
            new URL("_redirects", dir),
            `${base}es ${base} 301\n${base}es/ ${base} 301\n`,
          );
        },
      },
    },
  ],
});
