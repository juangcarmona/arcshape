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
  it("verifies both Astro outputs at root and subpath bases without Cloudflare deployment", () => {
    const steps = workflow.jobs.build.steps;
    expect(steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Build and verify Cloudflare static output (without deployment)",
          run: expect.stringContaining("src/public-site run verify"),
          env: expect.objectContaining({ SITE_BASE: "/" }),
        }),
        expect.objectContaining({
          name: "Verify public Astro root and subpath outputs",
          env: expect.objectContaining({ SITE_BASE: "/arcshape/" }),
        }),
        expect.objectContaining({
          name: "Verify engineering Astro root output",
          run: expect.stringContaining("verify-engineering-shell.mjs"),
          env: expect.objectContaining({ SITE_BASE: "/" }),
        }),
        expect.objectContaining({
          name: "Verify engineering Astro subpath output",
          run: expect.stringContaining("verify-engineering-shell.mjs"),
          env: expect.objectContaining({ SITE_BASE: "/arcshape/" }),
        }),
      ]),
    );
    const serialized = JSON.stringify(workflow);
    expect(serialized).not.toMatch(
      /wrangler|cloudflare_api_token|pages\.dev deploy/i,
    );
    expect(workflow.on.pull_request.paths).toContain("src/public-site/**");
    expect(workflow.on.push.paths).toContain("src/engineering-portal/**");
  });

  it("builds both generated snapshots and the portal from the exact checked out revision", () => {
    expect(workflow.on.pull_request.branches).toContain("main");
    expect(workflow.on.workflow_run.workflows).toContain("Assurance");
    const steps = workflow.jobs.build.steps;
    expect(steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Build engineering portal shell",
          run: expect.stringContaining("src/engineering-portal run build"),
        }),
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
          name: "Verify published routes and allowlisted evidence",
          run: expect.stringContaining("verify-engineering-portal.mjs"),
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
