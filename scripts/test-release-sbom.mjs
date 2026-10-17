#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveReleaseSbom } from "./upload-release-sbom.mjs";

const directory = await mkdtemp(join(tmpdir(), "arcshape-release-sbom-test-"));
try {
  const packageJson = { name: "@arcshape/cli", version: "0.1.1" };
  const file = join(directory, "arcshape-0.1.1-sbom.cdx.json");
  const bom = {
    components: [
      {
        name: "@arcshape/cli",
        version: "0.1.1",
        externalReferences: [
          {
            type: "distribution",
            url: "https://registry.npmjs.org/@arcshape/cli/-/cli-0.1.1.tgz",
          },
        ],
      },
    ],
  };
  await writeFile(file, JSON.stringify(bom));
  assert.deepEqual(await resolveReleaseSbom(directory, "v0.1.1", packageJson), {
    file,
    releaseTag: "v0.1.1",
    version: "0.1.1",
  });
  await assert.rejects(
    resolveReleaseSbom(directory, "v0.1.2", packageJson),
    /does not match package version/,
  );
  await writeFile(
    file,
    JSON.stringify({
      components: [{ name: "@arcshape/cli", version: "0.1.2" }],
    }),
  );
  await assert.rejects(
    resolveReleaseSbom(directory, "v0.1.1", packageJson),
    /does not contain/,
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}

console.log("Release SBOM tag and asset-name fixtures passed.");
