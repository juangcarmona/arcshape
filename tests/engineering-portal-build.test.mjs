import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

const tempDirs = [];
const sha = "a".repeat(40);
async function setup() {
  const dir = await mkdtemp(join(tmpdir(), "arcshape-portal-"));
  tempDirs.push(dir);
  await mkdir(join(dir, "src/engineering-portal"), { recursive: true });
  await mkdir(join(dir, "src/public-site/assets"), { recursive: true });
  await mkdir(join(dir, "_site/model"), { recursive: true });
  await mkdir(join(dir, "_site/architecture"), { recursive: true });
  await writeFile(
    join(dir, "src/engineering-portal/index.html"),
    '<html><body><a id="e2e-card" href="e2e/latest/" hidden></a>__SOURCE_SHA__</body></html>',
  );
  await writeFile(join(dir, "_site/model/index.html"), `model ${sha}`);
  await writeFile(
    join(dir, "_site/architecture/index.html"),
    `architecture ${sha}`,
  );
  return dir;
}

afterEach(async () =>
  Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  ),
);

describe("engineering portal assembly", () => {
  it("preserves old root architecture section bookmarks under the architecture route", async () => {
    const portal = await readFile(
      join(process.cwd(), "src/engineering-portal/index.html"),
      "utf8",
    );
    expect(portal).toContain('location.hash.startsWith("#/section/")');
    expect(portal).toContain(
      'location.replace("architecture/" + location.hash)',
    );
  });

  it("requires the landing and both source-stamped snapshots before publication", async () => {
    const dir = await setup();
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    expect(await readFile(join(dir, "_site/index.html"), "utf8")).toContain(
      sha,
    );
  });

  it("publishes only allowlisted completed run fields", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify({
        repository: "juangcarmona/arcshape",
        run_id: 41,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    expect(
      await readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).toContain("GitHub Actions run 41");
    expect(
      Object.keys(
        JSON.parse(
          await readFile(join(dir, "_site/e2e/latest/summary.json"), "utf8"),
        ),
      ).sort(),
    ).toEqual(["completed_at", "result", "run_id", "source_commit"]);
    expect(
      await readFile(join(dir, "_site/e2e/latest/summary.json"), "utf8"),
    ).not.toContain("repository");
    expect(await readFile(join(dir, "_site/index.html"), "utf8")).not.toContain(
      "hidden",
    );
  });

  it("omits malformed or unexpected summary fields without failing the required portal", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify({
        repository: "juangcarmona/arcshape",
        run_id: 41,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
        trace: "private",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
    expect(await readFile(join(dir, "_site/index.html"), "utf8")).toContain(
      sha,
    );
  });

  it("rejects summaries from a different repository identity", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify({
        repository: "somewhere/else",
        run_id: 41,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
  });

  it("rejects a summary whose embedded run id does not match the selected Actions run", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify({
        repository: "juangcarmona/arcshape",
        run_id: 41,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      {
        cwd: dir,
        env: { ...process.env, SOURCE_SHA: sha, SELECTED_RUN_ID: "42" },
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
  });

  it("rejects a summary whose source commit does not match the selected Actions run", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify({
        repository: "juangcarmona/arcshape",
        run_id: 42,
        source_commit: "b".repeat(40),
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      {
        cwd: dir,
        env: {
          ...process.env,
          SOURCE_SHA: sha,
          SELECTED_RUN_ID: "42",
          SELECTED_SOURCE_COMMIT: sha,
        },
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
  });

  it("omits invalid Actions completion metadata without blocking the portal", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify({
        repository: "juangcarmona/arcshape",
        run_id: 42,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      {
        cwd: dir,
        env: {
          ...process.env,
          SOURCE_SHA: sha,
          SELECTED_RUN_ID: "42",
          SELECTED_SOURCE_COMMIT: sha,
          SELECTED_COMPLETED_AT: "invalid",
        },
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
    expect(await readFile(join(dir, "_site/index.html"), "utf8")).toContain(
      sha,
    );
  });

  it("carries forward a safe summary when no newer artifact is available", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-carry-forward"));
    await writeFile(
      join(dir, ".e2e-carry-forward/summary.json"),
      JSON.stringify({
        run_id: 41,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    expect(
      await readFile(join(dir, "_site/e2e/latest/summary.json"), "utf8"),
    ).toContain('"run_id": 41');
  });

  it("carries forward the last safe summary when retrieval fails or the new artifact is malformed", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await mkdir(join(dir, ".e2e-carry-forward"));
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify({ result: "success", trace: "must not publish" }),
    );
    await writeFile(
      join(dir, ".e2e-carry-forward/summary.json"),
      JSON.stringify({
        run_id: 41,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    expect(
      await readFile(join(dir, "_site/e2e/latest/summary.json"), "utf8"),
    ).toContain('"run_id": 41');
    expect(
      await readFile(join(dir, "_site/e2e/latest/summary.json"), "utf8"),
    ).not.toContain("trace");
  });

  it("keeps the E2E route and landing link absent when no summary exists initially", async () => {
    const dir = await setup();
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
    expect(await readFile(join(dir, "_site/index.html"), "utf8")).toContain(
      'id="e2e-card" href="e2e/latest/" hidden',
    );
  });

  it("removes a stale E2E route when no safe summary is available", async () => {
    const dir = await setup();
    await mkdir(join(dir, "_site/e2e/latest"), { recursive: true });
    await writeFile(
      join(dir, "_site/e2e/latest/index.html"),
      "stale private data",
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
  });

  it("keeps the newer main run when artifacts arrive out of order", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-latest"));
    await mkdir(join(dir, ".e2e-carry-forward"));
    const envelope = (run_id) => ({
      repository: "juangcarmona/arcshape",
      run_id,
      source_commit: sha,
      completed_at: "2026-10-18T00:00:00Z",
      result: "success",
    });
    const projection = (run_id) => {
      const { run_id: id, source_commit, completed_at, result } =
        envelope(run_id);
      return { run_id: id, source_commit, completed_at, result };
    };
    await writeFile(
      join(dir, ".e2e-latest/summary.json"),
      JSON.stringify(envelope(41)),
    );
    await writeFile(
      join(dir, ".e2e-carry-forward/summary.json"),
      JSON.stringify(projection(44)),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      { cwd: dir, env: { ...process.env, SOURCE_SHA: sha }, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
    expect(
      await readFile(join(dir, "_site/e2e/latest/summary.json"), "utf8"),
    ).toContain('"run_id": 44');
  });

  it("removes the public E2E route when an operator requests removal", async () => {
    const dir = await setup();
    await mkdir(join(dir, ".e2e-carry-forward"));
    await writeFile(
      join(dir, ".e2e-carry-forward/summary.json"),
      JSON.stringify({
        repository: "juangcarmona/arcshape",
        run_id: 44,
        source_commit: sha,
        completed_at: "2026-10-18T00:00:00Z",
        result: "success",
      }),
    );
    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "scripts/build-engineering-portal.mjs"),
        "--out",
        join(dir, "_site"),
      ],
      {
        cwd: dir,
        env: {
          ...process.env,
          SOURCE_SHA: sha,
          DISABLE_E2E_SUMMARY: "true",
        },
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
    await expect(
      readFile(join(dir, "_site/e2e/latest/index.html"), "utf8"),
    ).rejects.toThrow();
    expect(await readFile(join(dir, "_site/index.html"), "utf8")).toContain(
      "hidden",
    );
  });
});
