import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("issue-linked branch naming", () => {
  it("accepts a branch tied to an issue and rejects the former Codex name", () => {
    expect(() =>
      execFileSync(
        process.execPath,
        [
          "scripts/check-branch-name.mjs",
          "feat/47-agent-capability-distribution",
        ],
        { cwd: repositoryRoot },
      ),
    ).not.toThrow();
    expect(() =>
      execFileSync(
        process.execPath,
        [
          "scripts/check-branch-name.mjs",
          "codex/47-agent-capability-distribution",
        ],
        { cwd: repositoryRoot, stdio: "pipe" },
      ),
    ).toThrow();
  });
});
