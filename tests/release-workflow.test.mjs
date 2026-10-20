import { readFile } from "node:fs/promises";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";

const workflow = load(
  await readFile(
    new URL("../.github/workflows/publish.yml", import.meta.url),
    "utf8",
  ),
);

describe("Changesets release workflow", () => {
  it("runs version PR maintenance on main pushes and never publishes from that job", () => {
    expect(workflow.on.push.branches).toContain("main");
    expect(workflow.jobs["version-pr"].if).toBe("github.event_name == 'push'");
    expect(workflow.jobs["version-pr"].permissions).toEqual({
      contents: "write",
      "pull-requests": "write",
    });
    const versionSteps = workflow.jobs["version-pr"].steps;
    const changesetsStep = versionSteps.find((step) =>
      String(step.uses).startsWith("changesets/action@"),
    );
    expect(changesetsStep.with).toMatchObject({
      version: "npm run version",
      commit: "chore: Version Packages",
      title: "Version Packages",
    });
    expect(JSON.stringify(versionSteps)).not.toMatch(
      /npm publish|changeset publish/,
    );
    expect(JSON.stringify(versionSteps)).not.toContain("git push");
    expect(JSON.stringify(versionSteps)).not.toContain("HEAD:main");
  });

  it("publishes only a merged Version Packages commit or explicit recovery dispatch", () => {
    const publish = workflow.jobs["publish-stable"];
    expect(publish.if).toContain(
      "contains(github.event.head_commit.message, 'Version Packages')",
    );
    expect(publish.if).toContain("publish-current-stable");
    expect(publish.environment).toEqual({ name: "npm-publish" });
    expect(publish.permissions).toEqual({
      contents: "write",
      "id-token": "write",
    });
    const serializedSteps = JSON.stringify(publish.steps);
    expect(serializedSteps).toContain("scripts/check-release-state.mjs");
    expect(serializedSteps).toContain(
      "npm publish --provenance --access public",
    );
    expect(serializedSteps).toContain("scripts/verify-published-version.mjs");
    expect(serializedSteps).toContain("refs/tags/${tag}");
    expect(serializedSteps).toContain("Resolve release evidence commit");
    const tagStep = publish.steps.find(
      (step) => step.name === "Synchronize package tag",
    );
    expect(tagStep.run).toContain('git tag "${tag}" "$RELEASE_COMMIT"');
    const releaseStep = publish.steps.find(
      (step) => step.name === "Create or reuse GitHub Release",
    );
    expect(releaseStep.run).toContain(
      'RELEASE_TAG="$GITHUB_TAG" RELEASE_COMMIT="$RELEASE_COMMIT"',
    );
    expect(serializedSteps).toContain("gh release create");
    expect(serializedSteps).toContain("scripts/upload-release-sbom.mjs");
  });

  it("keeps GitHub Release creation inside the single publisher workflow", () => {
    expect(workflow.on.release).toBeUndefined();
    expect(workflow.concurrency).toEqual({
      group: "release-${{ github.ref }}",
      "cancel-in-progress": false,
    });
    expect(workflow.permissions).toEqual({});
  });
});
