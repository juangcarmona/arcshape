import { readFile } from "node:fs/promises";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";

const workflow = load(
  await readFile(
    new URL("../.github/workflows/assurance.yml", import.meta.url),
    "utf8",
  ),
);

describe("risk-based assurance workflow", () => {
  it("runs bounded E2E and passive DAST jobs for pull requests and main pushes", () => {
    expect(workflow.on.pull_request.branches).toEqual(["main"]);
    expect(workflow.on.push.branches).toEqual(["main"]);
    expect(workflow.jobs["end-to-end"]["timeout-minutes"]).toBeLessThanOrEqual(
      15,
    );
    expect(workflow.jobs["end-to-end"].steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ run: "npm run test:e2e" }),
      ]),
    );
    expect(
      workflow.jobs["passive-dast"]["timeout-minutes"],
    ).toBeLessThanOrEqual(15);
    expect(
      workflow.jobs["passive-dast"].steps.find(({ name }) =>
        name?.includes("pinned passive ZAP"),
      ).run,
    ).toContain("-I -m 1");
  });

  it("creates a separate allowlisted summary only after a main branch E2E run", () => {
    const steps = workflow.jobs["end-to-end"].steps;
    const summary = steps.find(
      ({ name }) => name === "Write public-safe E2E summary",
    );
    const upload = steps.find(
      ({ name }) =>
        name === "Retain allowlisted summary for the engineering portal",
    );
    expect(summary.id).toBeUndefined();
    expect(summary.if).toContain("github.ref == 'refs/heads/main'");
    expect(summary.if).toContain("github.event_name != 'pull_request'");
    expect(summary.run).toContain("repository:process.env.GITHUB_REPOSITORY");
    expect(summary.run).toContain("source_commit:process.env.GITHUB_SHA");
    expect(summary.run).toContain("completed_at");
    expect(summary.run).toContain("result:");
    expect(upload.with.name).toBe("arcshape-public-e2e-summary");
    expect(upload.with.path).toBe("public-e2e-summary/summary.json");
    expect(upload.with["retention-days"]).toBe(90);
  });

  it("scans only the loopback preview with a pinned ZAP image and verified policy", () => {
    const dast = workflow.jobs["passive-dast"].steps;
    const scan = dast.find(({ name }) => name?.includes("pinned passive ZAP"));
    expect(scan.run).toContain("ghcr.io/zaproxy/zaproxy:2.17.0@sha256:");
    expect(scan.run).toContain("http://127.0.0.1:8765");
    expect(scan.run).toContain("scripts/check-zap-report.mjs");
    expect(
      dast.find(({ name }) => name?.includes("synthetic High finding")).run,
    ).toContain("--self-test");
  });

  it("runs mutation analysis only on a schedule or manual dispatch with report validation", () => {
    const mutation = workflow.jobs["mutation-baseline"];
    expect(mutation.if).toContain("schedule");
    expect(mutation.if).toContain("workflow_dispatch");
    expect(mutation.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          run: "node scripts/check-mutation-report.mjs --self-test",
        }),
        expect.objectContaining({
          run: "node scripts/check-mutation-report.mjs reports/mutation/mutation.json",
        }),
      ]),
    );
    expect(mutation["timeout-minutes"]).toBeLessThanOrEqual(30);
  });
});
