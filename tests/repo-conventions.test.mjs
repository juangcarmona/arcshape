import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("branch naming", () => {
  it("accepts issue-linked and Changesets release branches", () => {
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
        ["scripts/check-branch-name.mjs", "changeset-release/main"],
        { cwd: repositoryRoot },
      ),
    ).not.toThrow();
  });

  it("rejects the former Codex name", () => {
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
