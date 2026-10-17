import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { runValidate } from "../bin/validate.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const productShapeCliPath = require.resolve("@prodshape/cli/dist/bin.js");
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("ProductShape citation validation", () => {
  it("skips cleanly when a repository has no ProductShape model", async () => {
    const root = await makeRepository(false);

    const { result, exitCode } = await runValidate(
      ["--citations", "--format", "json"],
      { cwd: root },
    );

    expect(exitCode).toBe(0);
    expect(result.productCitations).toMatchObject({
      status: "skipped",
      summary: { total: 0 },
    });
  });

  it("verifies a current citation against the approved model artifact", async () => {
    const root = await makeRepository(true);
    await writeCitation(root, "FR-ARC42-DOCUMENTATION");

    const { result, exitCode } = await runValidate(
      ["--citations", "--format", "json"],
      { cwd: root, productShapeCliPath },
    );

    expect(exitCode).toBe(0);
    expect(result.productCitations).toMatchObject({
      status: "verified",
      summary: { total: 1, current: 1, errors: 0 },
    });
    expect(result.productCitations.citations[0]).toMatchObject({
      id: "FR-ARC42-DOCUMENTATION",
      status: "current",
    });
  });

  it.each([
    [
      "stale",
      "FR-ARC42-DOCUMENTATION",
      "0".repeat(64),
      "PRODUCT061",
      0,
      "verified",
    ],
    [
      "unresolved",
      "FR-NOT-IN-MODEL",
      "0".repeat(64),
      "PRODUCT060",
      1,
      "invalid",
    ],
  ])(
    "surfaces %s citations",
    async (_label, id, digest, code, expectedExit, status) => {
      const root = await makeRepository(true);
      await writeCitation(root, id, digest);

      const { result, exitCode } = await runValidate(
        ["--citations", "--format", "json"],
        { cwd: root, productShapeCliPath },
      );

      expect(exitCode).toBe(expectedExit);
      expect(result.productCitations.status).toBe(status);
      expect(result.valid).toBe(expectedExit === 0);
      expect(
        result.productCitations.diagnostics.map((item) => item.code),
      ).toContain(code);
    },
  );

  it("reports when a model exists but the optional verifier is not installed", async () => {
    const root = await makeRepository(true);
    await writeCitation(root, "FR-ARC42-DOCUMENTATION");

    const { result, exitCode } = await runValidate(
      ["--citations", "--format", "json"],
      { cwd: root },
    );

    expect(exitCode).toBe(1);
    expect(result.productCitations).toMatchObject({
      status: "unavailable",
    });
    expect(result.productCitations.reason).toContain("@prodshape/cli");
  });
});

async function makeRepository(withModel) {
  const root = await mkdtemp(join(tmpdir(), "arcshape-citations-test-"));
  temporaryDirectories.push(root);
  const architectureDir = join(root, "docs", "architecture");
  await cp(join(packageRoot, "templates", "architecture"), architectureDir, {
    recursive: true,
  });

  if (withModel) {
    await cp(
      join(packageRoot, "docs", "product", "model"),
      join(root, "docs", "product", "model"),
      { recursive: true },
    );
    await cp(join(packageRoot, ".product"), join(root, ".product"), {
      recursive: true,
    });
  }
  return root;
}

async function writeCitation(root, id, suppliedDigest) {
  const artifactPath = join(
    root,
    "docs",
    "product",
    "model",
    "requirements",
    "functional",
    "fr-arc42-documentation.md",
  );
  const artifact = await readFile(artifactPath);
  const digest =
    suppliedDigest ?? createHash("sha256").update(artifact).digest("hex");
  const readmePath = join(root, "docs", "architecture", "README.md");
  const readme = await readFile(readmePath, "utf8");
  await writeFile(
    readmePath,
    `${readme}\n<!-- pdac:cite id="${id}" digest="sha256:${digest}" -->\n`,
  );
}
