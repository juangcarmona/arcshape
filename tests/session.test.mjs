import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runSession } from "../packages/cli/src/bin/session.mjs";

const temporaryDirectories = [];
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("repository analysis sessions", () => {
  it("inventories repositories with different languages and documentation maturity without a language allowlist", async () => {
    const examples = join(packageRoot, "examples/repository-analysis");
    const mature = await copyFixture(join(examples, "mature-python"));
    const sparse = await copyFixture(join(examples, "sparse-rust"));

    const matureStart = await command(mature, "start", "--id", "mature-python");
    const sparseStart = await command(sparse, "start", "--id", "sparse-rust");
    expect(matureStart.data.evidenceCount).toBe(4);
    expect(sparseStart.data.evidenceCount).toBe(2);

    const matureState = JSON.parse(
      await readFile(
        join(mature, ".arcshape/sessions/mature-python/session.json"),
        "utf8",
      ),
    );
    const sparseState = JSON.parse(
      await readFile(
        join(sparse, ".arcshape/sessions/sparse-rust/session.json"),
        "utf8",
      ),
    );
    expect(matureState.evidence.map((item) => item.path)).toEqual(
      expect.arrayContaining([
        "README.md",
        "docs/architecture.md",
        "config/runtime.yaml",
        "src/worker.py",
      ]),
    );
    expect(sparseState.evidence.map((item) => item.path)).toEqual(
      expect.arrayContaining(["Cargo.toml", "src/main.rs"]),
    );
    expect(
      matureState.evidence.every((item) => item.status === "pending"),
    ).toBe(true);
    expect(
      sparseState.evidence.every((item) => item.status === "pending"),
    ).toBe(true);
    expect(
      (await command(mature, "next", "--session", "mature-python")).data.round,
    ).toBe("documentation");
    expect(
      (await command(sparse, "next", "--session", "sparse-rust")).data.round,
    ).toBe("repository-configuration");
  });

  it("persists bounded rounds and resumes coverage, leads, and questions", async () => {
    const root = await makeRepository();
    const statePath = join(root, ".arcshape/sessions/dogfood/session.json");

    const started = await command(
      root,
      "start",
      "--id",
      "dogfood",
      "--batch-size",
      "1",
    );
    expect(started.data.action).toBe("started");
    expect(started.data.evidenceCount).toBe(4);

    const state = JSON.parse(await readFile(statePath, "utf8"));
    const paths = state.evidence.map((item) => item.path);
    expect(paths).toContain("docs/architecture.md");
    expect(paths).toContain("config/settings.yaml");
    expect(paths).toContain("src/main.py");
    expect(paths).toContain("assets/image.png");
    expect(paths.join("\n")).not.toMatch(/node_modules|dist\/|\.env|secrets/);
    expect(
      state.evidence.find((item) => item.path === "assets/image.png"),
    ).toMatchObject({
      status: "excluded",
      exclusionReason: "binary file; content not included in analysis rounds",
    });

    const firstRound = await command(root, "next", "--session", "dogfood");
    expect(firstRound.data).toMatchObject({
      action: "next-round",
      round: "documentation",
      limit: 1,
    });
    expect(firstRound.data.evidence).toHaveLength(1);
    const docsEvidence = firstRound.data.evidence[0];
    await command(
      root,
      "mark",
      docsEvidence.id,
      "--as",
      "represented",
      "--note",
      "Architecture overview checked",
      "--session",
      "dogfood",
    );

    // A separate CLI invocation resumes from the saved state and advances to configuration.
    const secondRound = await command(root, "next", "--session", "dogfood");
    expect(secondRound.data).toMatchObject({
      action: "next-round",
      round: "repository-configuration",
    });
    const configEvidence = secondRound.data.evidence[0];
    await command(
      root,
      "mark",
      configEvidence.id,
      "--as",
      "contradiction",
      "--note",
      "README and config disagree",
      "--session",
      "dogfood",
    );
    const retracted = await command(
      root,
      "unmark",
      configEvidence.id,
      "--note",
      "Reclassifying after checking the source",
      "--session",
      "dogfood",
    );
    expect(retracted.data.retracted).toBe(1);
    const correctedState = JSON.parse(await readFile(statePath, "utf8"));
    expect(
      correctedState.evidence.find((item) => item.id === configEvidence.id)
        .history[0],
    ).toMatchObject({
      action: "retracted",
      note: "Reclassifying after checking the source",
      findings: [{ classification: "contradiction" }],
    });
    await command(
      root,
      "mark",
      configEvidence.id,
      "--as",
      "represented",
      "--note",
      "Configuration claim verified",
      "--session",
      "dogfood",
    );

    const lead = await command(
      root,
      "lead",
      "add",
      "--text",
      "Inspect the deployment entry point",
      "--source",
      configEvidence.id,
      "--session",
      "dogfood",
    );
    expect(lead.data.lead).toMatchObject({
      id: "L-0001",
      source: configEvidence.id,
    });
    const question = await command(
      root,
      "question",
      "add",
      "--text",
      "Is the worker deployed separately?",
      "--source",
      "src/main.py",
      "--session",
      "dogfood",
    );
    expect(question.data.question).toMatchObject({
      id: "Q-0001",
      status: "open",
      answer: null,
    });
    await command(
      root,
      "question",
      "answer",
      "Q-0001",
      "--text",
      "Yes, it runs as a separate process.",
      "--session",
      "dogfood",
    );

    const remaining = await command(root, "next", "--session", "dogfood");
    expect(remaining.data.round).toBe("implementation-and-tests");
    await command(
      root,
      "mark",
      remaining.data.evidence[0].id,
      "--as",
      "represented",
      "--session",
      "dogfood",
    );

    const complete = await command(root, "next", "--session", "dogfood");
    expect(complete.data).toMatchObject({
      action: "coverage-complete",
      pending: 0,
    });
    const report = await command(root, "report", "--session", "dogfood");
    expect(report.data.coverage).toMatchObject({ reviewed: 3, excluded: 1 });
    expect(report.data.openQuestions).toEqual([]);
    expect(report.data.answeredQuestions[0]).toMatchObject({
      id: "Q-0001",
      status: "answered",
    });
    expect(report.data.leads[0]).toMatchObject({
      id: "L-0001",
      source: configEvidence.id,
    });
  });

  it("marks modified and removed evidence as changed and requires rereading before acceptance", async () => {
    const root = await makeRepository({ minimal: true });
    const path = join(root, "README.md");
    await writeFile(path, "Initial evidence\n");
    await command(root, "start", "--id", "drift", "--batch-size", "1");
    const initialRound = await command(root, "next", "--session", "drift");
    const evidence = initialRound.data.evidence[0];
    await command(
      root,
      "mark",
      evidence.id,
      "--as",
      "represented",
      "--session",
      "drift",
    );

    await writeFile(path, "Changed evidence\n");
    const status = await command(root, "status", "--session", "drift");
    expect(status.data.coverage.changed).toBe(1);
    const waiting = await command(root, "next", "--session", "drift");
    expect(waiting.data).toMatchObject({
      action: "awaiting-changed-evidence",
      changed: 1,
    });

    await expect(
      command(
        root,
        "mark",
        evidence.id,
        "--as",
        "represented",
        "--session",
        "drift",
      ),
    ).rejects.toThrow("changed since it was inventoried; re-read it");
    await command(
      root,
      "mark",
      evidence.id,
      "--as",
      "represented",
      "--accept-changed",
      "--session",
      "drift",
    );
    const updated = JSON.parse(
      await readFile(
        join(root, ".arcshape/sessions/drift/session.json"),
        "utf8",
      ),
    ).evidence[0];
    expect(updated).toMatchObject({
      status: "reviewed",
      findings: [
        { classification: "represented" },
        { classification: "represented" },
      ],
    });

    await rm(path);
    const report = await command(root, "report", "--session", "drift");
    expect(report.data.changedEvidence).toEqual([
      expect.objectContaining({ path: "README.md", change: "removed" }),
    ]);
  });

  it("excludes root and nested gitignored paths while honoring negation rules", async () => {
    const root = await makeRepository({ minimal: true });
    await mkdir(join(root, "services/web/dist"), { recursive: true });
    await mkdir(join(root, "services/web/logs"), { recursive: true });
    await mkdir(join(root, "services/api/dist"), { recursive: true });
    await writeFile(join(root, ".gitignore"), "*.log\n!keep.log\n");
    await writeFile(join(root, "drop.log"), "generated\n");
    await writeFile(join(root, "keep.log"), "review this\n");
    await writeFile(
      join(root, "services/web/.gitignore"),
      "dist/\nlogs/*.log\n!logs/keep.log\n",
    );
    await writeFile(join(root, "services/web/dist/bundle.js"), "built\n");
    await writeFile(join(root, "services/web/logs/drop.log"), "generated\n");
    await writeFile(join(root, "services/web/logs/keep.log"), "review this\n");
    await writeFile(
      join(root, "services/api/dist/bundle.js"),
      "source evidence\n",
    );

    await command(root, "start", "--id", "ignored");
    const state = JSON.parse(
      await readFile(
        join(root, ".arcshape/sessions/ignored/session.json"),
        "utf8",
      ),
    );
    const paths = state.evidence.map((item) => item.path);
    expect(paths).toContain("keep.log");
    expect(paths).toContain("services/web/logs/keep.log");
    expect(paths).toContain("services/api/dist/bundle.js");
    expect(paths).not.toContain("drop.log");
    expect(paths).not.toContain("services/web/dist/bundle.js");
    expect(paths).not.toContain("services/web/logs/drop.log");
  });

  it("keeps protected secret exclusions ahead of gitignore negation rules", async () => {
    const root = await makeRepository({ minimal: true });
    await writeFile(join(root, ".gitignore"), "*\n!.env\n");
    await writeFile(join(root, ".env"), "TOKEN=secret\n");
    await writeFile(join(root, "README.md"), "Architecture overview\n");

    await command(root, "start", "--id", "secrets");
    const state = JSON.parse(
      await readFile(
        join(root, ".arcshape/sessions/secrets/session.json"),
        "utf8",
      ),
    );
    expect(state.evidence.map((item) => item.path)).toEqual([]);
  });

  it("tracks files becoming ignored and later unignored as changed evidence", async () => {
    const root = await makeRepository({ minimal: true });
    const evidencePath = join(root, "src/worker.md");
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(evidencePath, "Worker architecture\n");
    await command(root, "start", "--id", "ignore-drift");
    const initial = await command(root, "next", "--session", "ignore-drift");
    const evidence = initial.data.evidence[0];
    await command(
      root,
      "mark",
      evidence.id,
      "--as",
      "represented",
      "--session",
      "ignore-drift",
    );

    await writeFile(join(root, ".gitignore"), "src/worker.md\n");
    const ignored = await command(root, "status", "--session", "ignore-drift");
    expect(ignored.data.coverage).toMatchObject({ pending: 1, excluded: 1 });
    let state = JSON.parse(
      await readFile(
        join(root, ".arcshape/sessions/ignore-drift/session.json"),
        "utf8",
      ),
    );
    expect(
      state.evidence.find((item) => item.path === "src/worker.md"),
    ).toMatchObject({
      status: "excluded",
      exclusionReason: "ignored by repository .gitignore rules",
      previousStatus: "reviewed",
    });
    expect(
      (await command(root, "report", "--session", "ignore-drift")).data,
    ).toMatchObject({
      coverage: { excluded: 1 },
      changedEvidence: [],
    });

    await writeFile(join(root, ".gitignore"), "");
    const unignored = await command(
      root,
      "status",
      "--session",
      "ignore-drift",
    );
    expect(unignored.data.coverage.changed).toBe(2);
    state = JSON.parse(
      await readFile(
        join(root, ".arcshape/sessions/ignore-drift/session.json"),
        "utf8",
      ),
    );
    expect(
      state.evidence.find((item) => item.path === "src/worker.md"),
    ).toMatchObject({
      status: "changed",
      previousStatus: "excluded",
      change: "unignored",
    });
    expect(
      (await command(root, "report", "--session", "ignore-drift")).data,
    ).toMatchObject({
      changedEvidence: expect.arrayContaining([
        expect.objectContaining({ path: "src/worker.md", change: "unignored" }),
      ]),
    });
    await expect(
      command(
        root,
        "mark",
        evidence.id,
        "--as",
        "represented",
        "--session",
        "ignore-drift",
      ),
    ).rejects.toThrow("changed since it was inventoried; re-read it");
  });

  it("rejects duplicate sessions, unknown evidence, invalid classifications, and corrupt state without deleting it", async () => {
    const root = await makeRepository({ minimal: true });
    await writeFile(join(root, "README.md"), "Architecture overview\n");
    await command(root, "start", "--id", "duplicate");

    await expect(command(root, "start", "--id", "duplicate")).rejects.toThrow(
      "already exists",
    );
    await expect(
      command(
        root,
        "mark",
        "E-missing",
        "--as",
        "represented",
        "--session",
        "duplicate",
      ),
    ).rejects.toThrow("unknown evidence id");
    const evidence = (await command(root, "next", "--session", "duplicate"))
      .data.evidence[0];
    await expect(
      command(
        root,
        "mark",
        evidence.id,
        "--as",
        "invented",
        "--session",
        "duplicate",
      ),
    ).rejects.toThrow("--as must be one of");
    await expect(
      command(
        root,
        "question",
        "answer",
        "Q-9999",
        "--text",
        "answer",
        "--session",
        "duplicate",
      ),
    ).rejects.toThrow("unknown question id");

    const statePath = join(root, ".arcshape/sessions/duplicate/session.json");
    await writeFile(statePath, "not valid json\n");
    await expect(
      command(root, "status", "--session", "duplicate"),
    ).rejects.toThrow("invalid JSON state; preserve the file");
    expect(await readFile(statePath, "utf8")).toBe("not valid json\n");
  });

  it("requires an explicit session when multiple sessions exist", async () => {
    const root = await makeRepository({ minimal: true });
    await command(root, "start", "--id", "alpha");
    await command(root, "start", "--id", "beta");
    await expect(command(root, "status")).rejects.toThrow(
      "multiple sessions exist (alpha, beta)",
    );
    expect(
      (await command(root, "status", "--session", "beta")).data.session,
    ).toBe("beta");
  });
});

async function makeRepository({ minimal = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), "arcshape-session-test-"));
  temporaryDirectories.push(root);
  if (minimal) return root;

  await mkdir(join(root, "docs"), { recursive: true });
  await mkdir(join(root, "config"), { recursive: true });
  await mkdir(join(root, "src"), { recursive: true });
  await mkdir(join(root, "assets"), { recursive: true });
  await mkdir(join(root, "node_modules", "private"), { recursive: true });
  await mkdir(join(root, "dist"), { recursive: true });
  await mkdir(join(root, "secrets"), { recursive: true });
  await writeFile(join(root, "docs/architecture.md"), "System architecture\n");
  await writeFile(join(root, "config/settings.yaml"), "runtime: local\n");
  await writeFile(join(root, "src/main.py"), "print('hello')\n");
  await writeFile(join(root, "assets/image.png"), Buffer.from([0, 1, 2, 3]));
  await writeFile(join(root, ".env.test"), "TOKEN=secret\n");
  await writeFile(join(root, "node_modules/private/index.js"), "secret\n");
  await writeFile(join(root, "dist/app.js"), "built\n");
  await writeFile(join(root, "secrets/credentials.json"), "secret\n");
  return root;
}

async function copyFixture(source) {
  const root = await mkdtemp(join(tmpdir(), "arcshape-language-fixture-"));
  temporaryDirectories.push(root);
  await cp(source, root, { recursive: true });
  return root;
}

async function command(root, ...args) {
  const oldDirectory = process.cwd();
  let output = "";
  const write = vi
    .spyOn(process.stdout, "write")
    .mockImplementation((chunk) => {
      output += String(chunk);
      return true;
    });
  try {
    process.chdir(root);
    const result = await runSession(args);
    return { ...result, data: JSON.parse(output) };
  } finally {
    process.chdir(oldDirectory);
    write.mockRestore();
  }
}
