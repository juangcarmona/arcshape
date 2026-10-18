import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const packageJson = JSON.parse(
  await readFile("packages/cli/package.json", "utf8"),
);
const tag = process.env.RELEASE_TAG;
const expected = `v${packageJson.version}`;
if (tag !== expected)
  throw new Error(
    `release tag ${tag ?? "(missing)"} does not match ${expected}`,
  );
await run("git", ["merge-base", "--is-ancestor", tag, "origin/main"]);
process.stdout.write(
  `Release tag matches package version ${packageJson.version}\n`,
);
