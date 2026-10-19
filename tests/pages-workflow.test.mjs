import { readFile } from "node:fs/promises";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";

const workflow = load(
  await readFile(
    new URL("../.github/workflows/pages.yml", import.meta.url),
    "utf8",
  ),
);

describe("GitHub Pages engineering portal workflow", () => {
  it("builds both generated snapshots and the portal from the exact checked out revision", () => {
    expect(workflow.on.pull_request.branches).toContain("main");
    expect(workflow.on.workflow_run.workflows).toContain("Assurance");
    const steps = workflow.jobs.build.steps;
    expect(steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Generate Product Snapshot",
          run: expect.stringContaining("prodshape graph --format html"),
        }),
        expect.objectContaining({
          name: "Generate Architecture Snapshot",
          run: expect.stringContaining("--source-ref"),
        }),
        expect.objectContaining({
          name: "Assemble and validate portal",
          run: expect.stringContaining("build-engineering-portal.mjs"),
        }),
        expect.objectContaining({
          name: "Download latest completed main Assurance summary",
        }),
      ]),
    );
    expect(
      steps.find(({ name }) => name === "Record source revision").run,
    ).toContain("git rev-parse HEAD");
    expect(steps.find(({ name }) => name === "Upload Pages artifact").if).toBe(
      "github.event_name != 'pull_request'",
    );
    expect(
      steps.find(
        ({ name }) =>
          name === "Download latest completed main Assurance summary",
      ).run,
    ).toContain("branch=main&status=completed&per_page=1");
    expect(
      steps.find(
        ({ name }) =>
          name === "Download latest completed main Assurance summary",
      ).run,
    ).toContain(".e2e-carry-forward");
    const selection = steps.find(
      ({ name }) => name === "Download latest completed main Assurance summary",
    ).run;
    expect(selection).toContain("select-assurance-run.mjs");
    expect(selection).not.toContain(".completed_at");
    expect(selection).not.toContain("IFS=$'\\t' read");
    expect(selection).toContain('run_id="$(sed -n');
    expect(workflow.jobs.build.if).toContain("head_branch == 'main'");
    expect(workflow.jobs.build.if).toContain(
      "head_repository.full_name == github.repository",
    );
  });

  it("keeps one complete serialized publisher and restricts deployment permissions", () => {
    expect(workflow.permissions).toEqual({ contents: "read", actions: "read" });
    expect(workflow.jobs.deploy.permissions).toEqual({
      pages: "write",
      "id-token": "write",
    });
    expect(workflow.jobs.deploy.environment.name).toBe("github-pages");
    expect(workflow.jobs.deploy.needs).toBe("build");
    expect(workflow.jobs.deploy.if).toContain(
      "github.event_name != 'pull_request'",
    );
    expect(workflow.concurrency.group).toContain("production");
    expect(workflow.concurrency["cancel-in-progress"]).toBe(
      "${{ github.event_name == 'pull_request' }}",
    );
  });
});
