import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { chmod } from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { detectProviders } from "../bin/agents/detect.mjs";
import {
  applyPlan,
  makePlan,
  knownCapabilities,
} from "../bin/agents/lifecycle.mjs";
import { loadRegistry } from "../bin/agents/registry.mjs";
import {
  confirmPlan,
  promptInitSelection,
  runAgents,
} from "../bin/agents/commands.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [];

afterEach(async () => {
  await Promise.all(
    targets
      .splice(0)
      .map((target) => rm(target, { recursive: true, force: true })),
  );
});

describe("portable agent capability package", () => {
  it("publishes four skills with unique Agent Skills metadata", async () => {
    const names = [];
    for (const capability of knownCapabilities) {
      const skill = await readFile(
        join(packageRoot, "capabilities", "skills", capability, "SKILL.md"),
        "utf8",
      );
      const [, name] = skill.match(/^name: ([a-z0-9-]+)$/m) ?? [];
      const [, description] = skill.match(/^description: (.+)$/m) ?? [];
      expect(name).toBe(capability);
      expect(description?.length).toBeGreaterThan(0);
      names.push(name);
    }
    expect(new Set(names).size).toBe(4);
  });

  it("validates provider IDs and records supported shared discovery roots", async () => {
    const registry = await loadRegistry(packageRoot);
    expect(registry.providers.map(({ id }) => id)).toEqual([
      "codex",
      "claude",
      "cursor",
      "windsurf",
      "gemini",
      "opencode",
      "copilot",
    ]);
    expect(
      registry.providers.find(({ id }) => id === "claude").projectSkillsRoot,
    ).toBe(".claude/skills");
    expect(
      registry.providers
        .filter(({ id }) => id !== "claude")
        .every(
          ({ projectSkillsRoot }) => projectSkillsRoot === ".agents/skills",
        ),
    ).toBe(true);
  });

  it("plans one shared copy plus a Claude-specific copy for mixed providers", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const plan = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex", "claude", "gemini"],
      capabilities: ["arc-adr"],
      scope: "project",
      registry,
    });
    expect(plan.actions.map(({ path }) => path).sort()).toEqual([
      ".agents/skills/arc-adr/SKILL.md",
      ".claude/skills/arc-adr/SKILL.md",
    ]);
    expect(plan.warnings).toHaveLength(1);
  });

  it("resolves explicit user scope beneath the user root", async () => {
    const userRoot = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const plan = await makePlan({
      packageRoot,
      targetRoot: await makeTarget(),
      userRoot,
      providers: ["claude"],
      capabilities: ["arc-adr"],
      scope: "user",
      registry,
    });
    expect(plan.manifestPath).toBe(
      join(userRoot, ".arcshape", "agent-capabilities.json"),
    );
    expect(plan.actions[0].destination).toBe(
      join(userRoot, ".claude", "skills", "arc-adr", "SKILL.md"),
    );
  });
});

describe("local provider detection", () => {
  it("reports explicit provider markers and ambiguous shared skills paths without running agents", async () => {
    const target = await makeTarget();
    await mkdir(join(target, ".claude"), { recursive: true });
    await writeFile(join(target, ".claude", "settings.json"), "{}");
    await mkdir(join(target, ".agents", "skills"), { recursive: true });
    const registry = await loadRegistry(packageRoot);
    const result = await detectProviders(registry, target, { PATH: "" });
    expect(result.detected.map(({ id }) => id)).toEqual(["claude"]);
    expect(result.detected[0].evidence).toContainEqual({
      kind: "repository-marker",
      strength: "weak",
      value: ".claude/settings.json",
    });
    expect(result.ambiguous.map(({ value }) => value)).toEqual([
      ".agents/skills",
    ]);
  });

  it("detects a provider executable by PATH presence without executing it", async () => {
    const target = await makeTarget();
    const executableDirectory = await makeTarget();
    const executable = join(
      executableDirectory,
      process.platform === "win32" ? "codex.CMD" : "codex",
    );
    await writeFile(executable, "this file must never be executed\n");
    await chmod(executable, 0o755);
    const registry = await loadRegistry(packageRoot);
    const result = await detectProviders(registry, target, {
      PATH: executableDirectory,
      PATHEXT: ".EXE;.CMD",
    });
    expect(result.detected.map(({ id }) => id)).toContain("codex");
    expect(result.detected[0].evidence[0]).toEqual({
      kind: "path-executable",
      strength: "strong",
      value: "codex",
    });
  });
});

describe("interactive capability selection", () => {
  it("offers provider, capability, and scope choices and confirms the preview", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const streams = ttyStreams("codex,claude\narc-adr,arc-c4\nuser\n");
    const selection = await promptInitSelection({
      options: {},
      registry,
      targetRoot: target,
      input: streams.input,
      output: streams.output,
    });
    expect(selection).toEqual({
      providers: ["codex", "claude"],
      capabilities: ["arc-adr", "arc-c4"],
      scope: "user",
    });
    const confirmation = ttyStreams("y\n");
    await expect(
      confirmPlan({ yes: false }, "Apply this plan?", confirmation),
    ).resolves.toBe(true);
    expect(streams.text()).toContain("Detected providers");
    expect(confirmation.text()).toContain("Apply this plan?");
  });

  it("treats an empty provider selection as the explicit CLI-only choice", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const streams = ttyStreams("\n");
    await expect(
      promptInitSelection({
        options: {},
        registry,
        targetRoot: target,
        input: streams.input,
        output: streams.output,
      }),
    ).resolves.toEqual({ providers: [], capabilities: [], scope: "project" });
  });
});

describe("agent CLI dry run", () => {
  it("previews selected capabilities without writing files", async () => {
    const target = await makeTarget();
    const output = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
    const result = await runAgents(
      ["install", "--target", target, "--providers", "codex", "--dry-run"],
      { packageRoot, output },
    );
    expect(result.plan.actions.length).toBeGreaterThan(
      knownCapabilities.length,
    );
    expect(
      result.plan.actions.some(({ path }) =>
        path.endsWith("arc-architecture/references/arc42/README.md"),
      ),
    ).toBe(true);
    expect(await readdir(target)).toEqual([]);
  });

  it("adds a provider without removing previously managed capabilities", async () => {
    const target = await makeTarget();
    const output = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
    const first = await runAgents(
      [
        "install",
        "--target",
        target,
        "--providers",
        "codex",
        "--capabilities",
        "arc-adr",
        "--yes",
      ],
      { packageRoot, output },
    );
    expect(first.exitCode).toBe(0);
    const second = await runAgents(
      [
        "install",
        "--target",
        target,
        "--providers",
        "claude",
        "--capabilities",
        "arc-c4",
        "--yes",
      ],
      { packageRoot, output },
    );
    expect(second.exitCode).toBe(0);
    expect(second.plan.providers).toEqual(["codex", "claude"]);
    expect(second.plan.capabilities).toEqual(["arc-adr", "arc-c4"]);
    expect(
      await readFile(
        join(target, ".agents", "skills", "arc-adr", "SKILL.md"),
        "utf8",
      ),
    ).toContain("name: arc-adr");
  });

  it("returns a failure status when an untracked destination conflicts", async () => {
    const target = await makeTarget();
    const destination = join(
      target,
      ".agents",
      "skills",
      "arc-adr",
      "SKILL.md",
    );
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, "maintainer-owned\n");
    const output = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
    const result = await runAgents(
      ["install", "--target", target, "--providers", "codex", "--yes"],
      { packageRoot, output },
    );
    expect(result.exitCode).toBe(1);
    expect(await readFile(destination, "utf8")).toBe("maintainer-owned\n");
  });
});

describe("managed capability lifecycle", () => {
  it("creates, updates unchanged files, preserves edited and untracked files, and safely removes managed files", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const initial = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: ["arc-adr", "arc-c4"],
      scope: "project",
      registry,
    });
    expect(initial.actions.map(({ action }) => action)).toEqual([
      "create",
      "create",
    ]);
    await applyPlan(initial);

    const skillPath = join(target, ".agents", "skills", "arc-adr", "SKILL.md");
    const edited = `${await readFile(skillPath, "utf8")}\nMaintainer edit\n`;
    await writeFile(skillPath, edited);
    await writeFile(
      join(target, ".agents", "skills", "arc-architecture", "SKILL.md"),
      "untracked\n",
    ).catch(async (error) => {
      if (error.code !== "ENOENT") throw error;
      await mkdir(join(target, ".agents", "skills", "arc-architecture"), {
        recursive: true,
      });
      await writeFile(
        join(target, ".agents", "skills", "arc-architecture", "SKILL.md"),
        "untracked\n",
      );
    });

    const update = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: ["arc-adr", "arc-c4", "arc-architecture"],
      scope: "project",
      registry,
      operation: "update",
    });
    expect(
      update.actions.find(({ path }) => path.includes("arc-adr")).action,
    ).toBe("preserve");
    expect(
      update.actions.find(({ path }) =>
        path.endsWith("arc-architecture/SKILL.md"),
      ).action,
    ).toBe("conflict");
    await applyPlan(update);
    expect(await readFile(skillPath, "utf8")).toBe(edited);

    const uninstall = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: [],
      scope: "project",
      registry,
      operation: "uninstall",
    });
    await applyPlan(uninstall);
    expect(await readFile(skillPath, "utf8")).toBe(edited);
    await expect(
      readFile(join(target, ".agents", "skills", "arc-c4", "SKILL.md")),
    ).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("rejects symlinked destinations before writing", async () => {
    const target = await makeTarget();
    const outside = await makeTarget();
    await mkdir(join(target, ".agents"), { recursive: true });
    const { symlink } = await import("node:fs/promises");
    await symlink(outside, join(target, ".agents", "skills"), "dir");
    const registry = await loadRegistry(packageRoot);
    await expect(
      makePlan({
        packageRoot,
        targetRoot: target,
        providers: ["codex"],
        capabilities: ["arc-adr"],
        scope: "project",
        registry,
      }),
    ).rejects.toThrow("symbolic link");
  });

  it("rejects a symlinked packaged capability root", async () => {
    const target = await makeTarget();
    const fakePackage = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    await mkdir(join(fakePackage, "capabilities", "skills"), {
      recursive: true,
    });
    await writeFile(
      join(fakePackage, "package.json"),
      JSON.stringify({ version: "1.0.0" }),
    );
    const { symlink } = await import("node:fs/promises");
    await symlink(
      join(packageRoot, "capabilities", "skills", "arc-architecture"),
      join(fakePackage, "capabilities", "skills", "arc-architecture"),
      "dir",
    );

    await expect(
      makePlan({
        packageRoot: fakePackage,
        targetRoot: target,
        providers: ["codex"],
        capabilities: ["arc-architecture"],
        scope: "project",
        registry,
        includeLegacy: false,
      }),
    ).rejects.toThrow("symbolic link packaged capability");
  });

  it("rejects symlinks nested inside a packaged capability", async () => {
    const target = await makeTarget();
    const fakePackage = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const skillRoot = join(
      fakePackage,
      "capabilities",
      "skills",
      "arc-architecture",
    );
    const outside = join(fakePackage, "outside");
    await mkdir(skillRoot, { recursive: true });
    await mkdir(outside, { recursive: true });
    await writeFile(
      join(fakePackage, "package.json"),
      JSON.stringify({ version: "1.0.0" }),
    );
    const { symlink } = await import("node:fs/promises");
    await symlink(outside, join(skillRoot, "references"), "dir");

    await expect(
      makePlan({
        packageRoot: fakePackage,
        targetRoot: target,
        providers: ["codex"],
        capabilities: ["arc-architecture"],
        scope: "project",
        registry,
        includeLegacy: false,
      }),
    ).rejects.toThrow("symbolic link in packaged capability");
  });

  it("rejects symlinks nested in the skill destination path", async () => {
    const target = await makeTarget();
    const outside = await makeTarget();
    await mkdir(join(target, ".agents", "skills", "arc-architecture"), {
      recursive: true,
    });
    const { symlink } = await import("node:fs/promises");
    await symlink(
      outside,
      join(target, ".agents", "skills", "arc-architecture", "references"),
      "dir",
    );
    const registry = await loadRegistry(packageRoot);

    await expect(
      makePlan({
        packageRoot,
        targetRoot: target,
        providers: ["codex"],
        capabilities: ["arc-architecture"],
        scope: "project",
        registry,
      }),
    ).rejects.toThrow("symbolic link in destination path");
  });

  it("reports and preserves conflicts at nested capability paths", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const nestedPath = join(
      target,
      ".agents/skills/arc-architecture/references/arc42/02-constraints/README.md",
    );
    await mkdir(dirname(nestedPath), { recursive: true });
    await writeFile(nestedPath, "maintainer-owned nested content\n");

    const plan = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: ["arc-architecture"],
      scope: "project",
      registry,
    });
    expect(
      plan.actions.find(({ path }) =>
        path.endsWith("references/arc42/02-constraints/README.md"),
      ).action,
    ).toBe("conflict");
    const failures = await applyPlan(plan);
    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain("references/arc42/02-constraints/README.md");
    expect(await readFile(nestedPath, "utf8")).toBe(
      "maintainer-owned nested content\n",
    );
  });

  it("installs nested references and preserves edited and untracked extension files", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const sectionPath = join(
      target,
      ".agents/skills/arc-architecture/references/arc42/02-constraints/README.md",
    );
    const extensionPath = join(
      target,
      ".agents/skills/arc-architecture/references/arc42/02-constraints/project-notes.md",
    );
    const install = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: ["arc-architecture"],
      scope: "project",
      registry,
    });
    expect(
      install.actions.some(({ path }) =>
        path.endsWith("references/arc42/02-constraints/README.md"),
      ),
    ).toBe(true);
    await applyPlan(install);
    expect(await readFile(sectionPath, "utf8")).toContain("# 2. Constraints");

    const edited = `${await readFile(sectionPath, "utf8")}\nMaintainer edit\n`;
    await writeFile(sectionPath, edited);
    await writeFile(extensionPath, "Project-specific extension\n");

    const update = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: ["arc-architecture"],
      scope: "project",
      registry,
      operation: "update",
    });
    expect(
      update.actions.find(({ path }) =>
        path.endsWith("02-constraints/README.md"),
      ).action,
    ).toBe("preserve");
    expect(
      update.actions.some(({ path }) => path.endsWith("project-notes.md")),
    ).toBe(false);
    await applyPlan(update);
    expect(await readFile(sectionPath, "utf8")).toBe(edited);
    expect(await readFile(extensionPath, "utf8")).toBe(
      "Project-specific extension\n",
    );

    const uninstall = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: [],
      scope: "project",
      registry,
      operation: "uninstall",
    });
    await applyPlan(uninstall);
    expect(await readFile(sectionPath, "utf8")).toBe(edited);
    expect(await readFile(extensionPath, "utf8")).toBe(
      "Project-specific extension\n",
    );
    const remainingReferences = await readdir(
      join(target, ".agents/skills/arc-architecture/references/arc42"),
      { recursive: true },
    );
    expect(remainingReferences).toContain("02-constraints/README.md");
    expect(remainingReferences).toContain("02-constraints/project-notes.md");
  });

  it("migrates an exact unchanged 0.1.1 file and preserves an edited legacy copy", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const legacyPath = join(
      target,
      ".agents",
      "skills",
      "arcshape-adr",
      "SKILL.md",
    );
    await mkdir(dirname(legacyPath), { recursive: true });
    const legacyContent = await readFile(
      join(packageRoot, "tests/fixtures/legacy-v0.1.1/arcshape-adr.md"),
    );
    await writeFile(legacyPath, legacyContent);
    const editedLegacyPath = join(
      target,
      ".claude",
      "skills",
      "arcshape-c4",
      "SKILL.md",
    );
    await mkdir(dirname(editedLegacyPath), { recursive: true });
    await writeFile(editedLegacyPath, "maintainer-edited legacy content\n");

    const plan = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: ["arc-adr"],
      scope: "project",
      registry,
    });
    expect(
      plan.actions.find(({ path }) => path.includes("arcshape-adr")).action,
    ).toBe("remove-legacy");
    expect(
      plan.actions.find(({ path }) => path.includes("arcshape-c4")).action,
    ).toBe("preserve");
    await applyPlan(plan);
    await expect(readFile(legacyPath)).rejects.toMatchObject({
      code: "ENOENT",
    });
    expect(await readFile(editedLegacyPath, "utf8")).toBe(
      "maintainer-edited legacy content\n",
    );
  });

  it("rejects a malformed manifest that claims a file outside capability paths", async () => {
    const target = await makeTarget();
    await mkdir(join(target, ".arcshape"), { recursive: true });
    await writeFile(
      join(target, ".arcshape", "agent-capabilities.json"),
      JSON.stringify({
        schemaVersion: 1,
        packageVersion: "0.1.1",
        scope: "project",
        providers: ["codex"],
        capabilities: ["arc-adr"],
        files: {
          ".agents/skills/arc-adr/../important.txt": "a".repeat(64),
        },
      }),
    );
    const registry = await loadRegistry(packageRoot);
    await expect(
      makePlan({
        packageRoot,
        targetRoot: target,
        providers: ["codex"],
        capabilities: ["arc-adr"],
        scope: "project",
        registry,
      }),
    ).rejects.toThrow("unsupported managed path");
  });

  it("does not overwrite a file created after the installation preview", async () => {
    const target = await makeTarget();
    const registry = await loadRegistry(packageRoot);
    const plan = await makePlan({
      packageRoot,
      targetRoot: target,
      providers: ["codex"],
      capabilities: ["arc-adr"],
      scope: "project",
      registry,
    });
    const destination = join(
      target,
      ".agents",
      "skills",
      "arc-adr",
      "SKILL.md",
    );
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, "raced user content\n");
    const failures = await applyPlan(plan);
    expect(failures.join("\n")).toContain("appeared during installation");
    expect(await readFile(destination, "utf8")).toBe("raced user content\n");
  });
});

async function makeTarget() {
  const target = await mkdtemp(join(tmpdir(), "arcshape-agents-test-"));
  targets.push(target);
  return target;
}

function ttyStreams(inputText) {
  const lines = inputText.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  const input = Readable.from(
    (async function* () {
      for (const line of lines) {
        await new Promise((resolve) => setTimeout(resolve, 5));
        yield line;
      }
    })(),
  );
  const chunks = [];
  const output = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });
  input.isTTY = true;
  output.isTTY = true;
  return { input, output, text: () => Buffer.concat(chunks).toString("utf8") };
}
