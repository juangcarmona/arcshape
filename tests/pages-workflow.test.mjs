import { readFile } from "node:fs/promises";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";

const workflow = load(
  await readFile(
    new URL("../.github/workflows/pages.yml", import.meta.url),
    "utf8",
  ),
);

describe("GitHub Pages workflow", () => {
  it("builds the reader for pull requests without uploading or deploying it", () => {
    expect(workflow.on.pull_request.branches).toContain("main");
    expect(workflow.jobs.build.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Generate reader site",
          run: expect.stringContaining("site build"),
        }),
        expect.objectContaining({
          name: "Upload Pages artifact",
          if: "github.event_name != 'pull_request'",
        }),
      ]),
    );
    expect(workflow.jobs.deploy.if).toContain(
      "github.event_name != 'pull_request'",
    );
  });

  it("limits deployment permissions to the protected main-branch environment", () => {
    expect(workflow.permissions).toEqual({ contents: "read" });
    expect(workflow.jobs.deploy.permissions).toEqual({
      pages: "write",
      "id-token": "write",
    });
    expect(workflow.jobs.deploy.environment.name).toBe("github-pages");
    expect(workflow.jobs.deploy.if).toContain(
      "github.ref == 'refs/heads/main'",
    );
    expect(workflow.concurrency.group).toContain("production");
  });
});
