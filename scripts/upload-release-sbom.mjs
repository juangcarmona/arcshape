#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export async function resolveReleaseSbom(directory, releaseTag, packageJson) {
  const expectedTag = `v${packageJson.version}`;
  if (releaseTag !== expectedTag) {
    throw new Error(
      `Release tag ${releaseTag} does not match package version ${expectedTag}`,
    );
  }
  const file = join(directory, `arcshape-${packageJson.version}-sbom.cdx.json`);
  const bom = JSON.parse(await readFile(file, "utf8"));
  const packageComponent = bom.components?.find(
    (component) =>
      component.name === packageJson.name &&
      component.version === packageJson.version,
  );
  if (!packageComponent) {
    throw new Error(
      `SBOM does not contain ${packageJson.name}@${packageJson.version}`,
    );
  }
  const expectedDistribution = `https://registry.npmjs.org/@arcshape/cli/-/cli-${packageJson.version}.tgz`;
  const hasRegistryUrl = packageComponent.externalReferences?.some(
    (reference) =>
      reference.type === "distribution" &&
      reference.url === expectedDistribution,
  );
  if (!hasRegistryUrl) {
    throw new Error(
      `SBOM distribution reference does not match ${expectedDistribution}`,
    );
  }
  return { file, releaseTag, version: packageJson.version };
}

async function main() {
  const [directory, releaseTag, option] = process.argv.slice(2);
  if (!directory || !releaseTag || (option && option !== "--dry-run")) {
    throw new Error(
      "Usage: node scripts/upload-release-sbom.mjs <sbom-directory> <release-tag> [--dry-run]",
    );
  }
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const release = await resolveReleaseSbom(directory, releaseTag, packageJson);
  const args = [
    "release",
    "upload",
    release.releaseTag,
    release.file,
    "--clobber",
  ];
  if (option === "--dry-run") {
    console.log(`gh ${args.join(" ")}`);
    return;
  }
  const result = spawnSync("gh", args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
