import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const IDENTIFIER = /^[0-9A-Za-z-]+$/;
const NUMERIC_IDENTIFIER = /^(0|[1-9]\d*)$/;

function isValidNpmVersion(value) {
  if (typeof value !== "string") return false;

  const buildIndex = value.indexOf("+");
  const withoutBuild = buildIndex === -1 ? value : value.slice(0, buildIndex);
  if (
    buildIndex !== -1 &&
    !value
      .slice(buildIndex + 1)
      .split(".")
      .every((part) => IDENTIFIER.test(part))
  ) {
    return false;
  }

  const prereleaseIndex = withoutBuild.indexOf("-");
  const core =
    prereleaseIndex === -1
      ? withoutBuild
      : withoutBuild.slice(0, prereleaseIndex);
  if (!VERSION.test(core)) return false;
  if (prereleaseIndex === -1) return true;

  const prerelease = withoutBuild.slice(prereleaseIndex + 1);
  return (
    prerelease.length > 0 &&
    prerelease.split(".").every((part) => {
      if (!IDENTIFIER.test(part)) return false;
      return !/^\d+$/.test(part) || NUMERIC_IDENTIFIER.test(part);
    })
  );
}

export function compareVersions(left, right) {
  const leftParts = VERSION.exec(left);
  const rightParts = VERSION.exec(right);
  if (!leftParts || !rightParts) {
    throw new Error(
      `Only stable x.y.z versions are supported: ${left}, ${right}`,
    );
  }
  for (let index = 1; index <= 3; index += 1) {
    const difference = Number(leftParts[index]) - Number(rightParts[index]);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

export function parsePublishedVersions(value) {
  const versions = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : null;
  if (!versions || versions.some((version) => !isValidNpmVersion(version))) {
    throw new Error("npm returned an invalid version list");
  }
  return [...new Set(versions.filter((version) => VERSION.test(version)))].sort(
    compareVersions,
  );
}

export function classifyReleaseState(
  packageName,
  packageVersion,
  publishedVersions,
) {
  if (typeof packageName !== "string" || packageName.length === 0) {
    throw new Error("Package name is required");
  }
  if (!VERSION.test(packageVersion)) {
    throw new Error(
      `Only stable x.y.z package versions are supported: ${packageVersion}`,
    );
  }
  const versions = parsePublishedVersions(publishedVersions);
  if (versions.includes(packageVersion)) {
    return { packageName, packageVersion, state: "already-published" };
  }
  const newerVersion = versions.find(
    (version) => compareVersions(version, packageVersion) > 0,
  );
  if (newerVersion) {
    return {
      packageName,
      packageVersion,
      state: "inconsistent",
      reason: `npm contains newer version ${newerVersion}`,
      newerVersion,
    };
  }
  return { packageName, packageVersion, state: "pending" };
}

export async function readPublishedVersions(packageName, run = execFileAsync) {
  try {
    const { stdout } = await run("npm", [
      "view",
      packageName,
      "versions",
      "--json",
    ]);
    return parsePublishedVersions(JSON.parse(stdout));
  } catch (error) {
    const output = `${error.stdout ?? ""}\n${error.stderr ?? ""}`;
    if (/E404|404 Not Found/i.test(output)) return [];
    throw new Error(
      `Could not read npm versions for ${packageName}: ${output.trim() || error.message}`,
    );
  }
}

export async function readReleaseState(
  manifestPath = new URL("../packages/cli/package.json", import.meta.url),
  run = execFileAsync,
) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const publishedVersions = await readPublishedVersions(manifest.name, run);
  return classifyReleaseState(
    manifest.name,
    manifest.version,
    publishedVersions,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const state = await readReleaseState();
  console.log(JSON.stringify(state));
  if (state.state === "inconsistent") process.exitCode = 1;
}
