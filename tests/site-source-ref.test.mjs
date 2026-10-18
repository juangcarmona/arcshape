import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";

let outputDirectory;

afterEach(async () => {
  if (outputDirectory) {
    await rm(outputDirectory, { recursive: true, force: true });
    outputDirectory = undefined;
  }
});

it("uses the requested source ref for repository links in the reader site", async () => {
  outputDirectory = await mkdtemp(join(tmpdir(), "arcshape-site-source-ref-"));
  const output = join(outputDirectory, "index.html");
  const result = spawnSync(
    process.execPath,
    [
      "packages/cli/src/bin/arcshape.mjs",
      "site",
      "build",
      "--out",
      output,
      "--title",
      "ArcShape",
      "--source-ref",
      "stable/1.x",
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);
  const html = await readFile(output, "utf8");
  expect(html).toContain(
    "https://github.com/juangcarmona/arcshape/tree/stable%2F1.x/docs/product/model/",
  );
}, 60_000);
