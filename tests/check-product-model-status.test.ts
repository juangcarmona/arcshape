import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findUnapprovedArtifacts } from "../scripts/check-product-model-status.js";

const temporaryDirectories: string[] = [];

async function makeModel(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "arcshape-model-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("findUnapprovedArtifacts", () => {
  it("accepts active, deprecated, and retired artifacts recursively", async () => {
    const directory = await makeModel();
    await mkdir(join(directory, "nested"));
    await writeFile(
      join(directory, "active.md"),
      "---\nid: A\nstatus: active\n---\n",
    );
    await writeFile(
      join(directory, "nested", "deprecated.md"),
      "---\nid: B\nstatus: deprecated\n---\n",
    );
    await writeFile(
      join(directory, "nested", "retired.md"),
      "---\nid: C\nstatus: retired\n---\n",
    );

    await expect(findUnapprovedArtifacts(directory)).resolves.toEqual([]);
  });

  it("reports draft or missing status frontmatter", async () => {
    const directory = await makeModel();
    await writeFile(
      join(directory, "draft.md"),
      "---\nid: A\nstatus: draft\n---\n",
    );
    await writeFile(join(directory, "missing.md"), "# No frontmatter\n");

    await expect(findUnapprovedArtifacts(directory)).resolves.toEqual([
      join(directory, "draft.md"),
      join(directory, "missing.md"),
    ]);
  });
});
