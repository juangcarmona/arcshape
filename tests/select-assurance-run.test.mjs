import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(
  new URL("../scripts/select-assurance-run.mjs", import.meta.url),
);

describe("Assurance run metadata selection", () => {
  it("keeps the run id and source commit paired when the API timestamp is null", () => {
    const run = {
      id: 39262305160,
      head_sha: "a".repeat(40),
      completed_at: null,
    };
    const result = spawnSync(process.execPath, [script], {
      input: JSON.stringify(run),
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe(
      `run_id=${run.id}\nsource_commit=${run.head_sha}\n`,
    );
  });

  it("writes empty selection fields when the completed run record is missing", () => {
    const result = spawnSync(process.execPath, [script], {
      input: "{}",
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe("run_id=\nsource_commit=\n");
  });
});
