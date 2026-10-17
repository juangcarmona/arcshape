import { setTimeout as wait } from "node:timers/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const version = process.env.PACKAGE_VERSION?.replace(/^v/, "");
if (!version) throw new Error("PACKAGE_VERSION is required");

for (let attempt = 1; attempt <= 12; attempt += 1) {
  try {
    const { stdout } = await run("npm", [
      "view",
      `arcshape@${version}`,
      "version",
    ]);
    if (stdout.trim() === version) {
      process.stdout.write(`Verified arcshape@${version} on npm\n`);
      process.exit(0);
    }
  } catch {
    // Registry propagation can lag behind a successful publish.
  }
  await wait(5_000);
}
throw new Error(`npm did not report arcshape@${version} after publication`);
