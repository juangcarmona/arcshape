import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const packageJson = JSON.parse(
  await readFile("packages/cli/package.json", "utf8"),
);
const tag = process.env.RELEASE_TAG;
const releaseCommit = process.env.RELEASE_COMMIT;
const expected = `v${packageJson.version}`;
if (tag !== expected)
  throw new Error(
    `release tag ${tag ?? "(missing)"} does not match ${expected}`,
  );
const tagCommit = (
  await run("git", ["rev-list", "-n", "1", `${tag}^{commit}`])
).stdout.trim();
if (releaseCommit && tagCommit !== releaseCommit) {
  throw new Error(
    `release tag ${tag} points to ${tagCommit}, expected ${releaseCommit}`,
  );
}
const taggedPackage = JSON.parse(
  (await run("git", ["show", `${tag}:packages/cli/package.json`])).stdout,
);
if (
  taggedPackage.name !== packageJson.name ||
  taggedPackage.version !== packageJson.version
) {
  throw new Error(
    `release tag ${tag} does not contain ${packageJson.name}@${packageJson.version}`,
  );
}
await run("git", ["merge-base", "--is-ancestor", tag, "origin/main"]);
process.stdout.write(
  `Release tag matches package version ${packageJson.version} at ${tagCommit}\n`,
);
