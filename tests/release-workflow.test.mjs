import { readFile } from "node:fs/promises";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";
import { releaseNotes } from "../scripts/release-notes.mjs";

const workflow = load(
  await readFile(
    new URL("../.github/workflows/publish.yml", import.meta.url),
    "utf8",
  ),
);

describe("Changesets release workflow", () => {
  it("publishes only the matching changelog entry, including upgrade instructions", () => {
    const prompt = "```text\nMigrate the diagrams after review.\n```";
    const changelog = `# Package\n\n## 1.2.0\n\n### Minor Changes\n\n${prompt}\n\n## 1.1.0\n\nOld release\n`;
    expect(releaseNotes(changelog, "1.2.0")).toBe(
      `### Minor Changes\n\n${prompt}\n`,
    );
    expect(() => releaseNotes(changelog, "1.3.0")).toThrow(
      "No changelog entry",
    );
    expect(() => releaseNotes("## 1.2.0\n\n## 1.1.0\nOld", "1.2.0")).toThrow(
      "Empty changelog entry",
    );
    const step = workflow.jobs["publish-stable"].steps.find(
      ({ name }) => name === "Create or reuse GitHub Release",
    );
    expect(step.run).toContain("node scripts/release-notes.mjs");
    expect(step.run).toContain(
      '--notes-file "$RUNNER_TEMP/arcshape-release-notes.md"',
    );
    expect(step.run).toContain("--generate-notes");
  });
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
      commit: "chore(release): version packages",
      title: "Version Packages",
    });
    expect(changesetsStep.env).toMatchObject({
      HUSKY: "0",
    });
    expect(JSON.stringify(versionSteps)).not.toMatch(
      /npm publish|changeset publish/,
    );
    expect(JSON.stringify(versionSteps)).not.toContain("git push");
    expect(JSON.stringify(versionSteps)).not.toContain("HEAD:main");
  });

  it("publishes only a merged Version Packages commit or explicit recovery dispatch", () => {
    const publish = workflow.jobs["publish-stable"];
    expect(workflow.jobs["release-mode"].outputs).toEqual({
      mode: "${{ steps.mode.outputs.mode }}",
    });
    expect(publish.needs).toBe("release-mode");
    expect(publish.if).toContain("needs.release-mode.outputs.mode == 'stable'");
    expect(publish.if).toContain(
      "startsWith(github.event.head_commit.message, 'chore(release): version packages')",
    );
    expect(publish.if).toContain(
      "startsWith(github.event.head_commit.message, 'Version Packages')",
    );
    expect(publish.if).not.toContain(
      "contains(github.event.head_commit.message, 'Version Packages')",
    );
    expect(publish.if).toContain("publish-current-stable");
    expect(publish.environment).toEqual({ name: "npm-publish" });
    expect(publish.permissions).toEqual({
      contents: "write",
      "id-token": "write",
    });
    const serializedSteps = JSON.stringify(publish.steps);
    expect(serializedSteps).toContain("npm run release");
    expect(serializedSteps).not.toContain("scripts/check-release-state.mjs");
    expect(serializedSteps).not.toContain("npm publish --provenance");
    const identityIndex = publish.steps.findIndex(
      (step) => step.name === "Configure release identity",
    );
    const publishIndex = publish.steps.findIndex(
      (step) => step.name === "Publish committed packages",
    );
    expect(identityIndex).toBeGreaterThanOrEqual(0);
    expect(identityIndex).toBeLessThan(publishIndex);
    expect(serializedSteps).toContain("scripts/verify-published-version.mjs");
    expect(serializedSteps).toContain("refs/tags/${tag}");
    expect(serializedSteps).toContain("Resolve release evidence commit");
    const tagStep = publish.steps.find(
      (step) => step.name === "Synchronize package tag",
    );
    expect(tagStep.env).toMatchObject({
      HUSKY: "0",
    });
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

  it("allows npm registry propagation without weakening exact-version verification", async () => {
    const verifier = await readFile(
      new URL("../scripts/verify-published-version.mjs", import.meta.url),
      "utf8",
    );
    const attempts = Number(
      /PUBLISH_VERIFICATION_ATTEMPTS = (\d+)/.exec(verifier)?.[1],
    );
    const delay = Number(
      /PUBLISH_VERIFICATION_DELAY_MS = ([\d_]+)/
        .exec(verifier)?.[1]
        .replaceAll("_", ""),
    );

    expect(attempts * delay).toBeGreaterThanOrEqual(300_000);
    expect(verifier).toContain("stdout.trim() === version");
  });

  it("does not treat a body mention as a Version Packages release subject", () => {
    const isVersionPackagesSubject = (message) =>
      message.startsWith("chore(release): version packages") ||
      message.startsWith("Version Packages");

    expect(
      isVersionPackagesSubject("chore(release): version packages\n\nbody"),
    ).toBe(true);
    expect(isVersionPackagesSubject("Version Packages\n\nbody")).toBe(true);
    expect(
      isVersionPackagesSubject(
        "chore: adopt release flow (#87)\n\nThe Version Packages flow is documented here.",
      ),
    ).toBe(false);
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
