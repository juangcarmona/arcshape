import { readFile } from "node:fs/promises";
import { setTimeout as wait } from "node:timers/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const { name: packageName } = JSON.parse(
  await readFile(
    new URL("../packages/cli/package.json", import.meta.url),
    "utf8",
  ),
);
if (!packageName) throw new Error("package.json must define a package name");

const version = process.env.PACKAGE_VERSION?.replace(/^v/, "");
if (!version) throw new Error("PACKAGE_VERSION is required");

for (let attempt = 1; attempt <= 12; attempt += 1) {
  try {
    const { stdout } = await run("npm", [
      "view",
      `${packageName}@${version}`,
      "version",
    ]);
    if (stdout.trim() === version) {
      process.stdout.write(`Verified ${packageName}@${version} on npm\n`);
      process.exit(0);
    }
  } catch {
    // Registry propagation can lag behind a successful publish.
  }
  await wait(5_000);
}
throw new Error(
  `npm did not report ${packageName}@${version} after publication`,
);
