import { lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep, join } from "node:path";
import { confirmPlan, promptInitSelection } from "./agents/commands.mjs";
import { loadRegistry } from "./agents/registry.mjs";
import { applyPlan, makePlan, readManagedState } from "./agents/lifecycle.mjs";

export async function runInit(
  args,
  {
    packageRoot,
    input = process.stdin,
    output = process.stdout,
    errorOutput = process.stderr,
  },
) {
  const options = parseOptions(args);
  if (options.help) {
    output.write(
      `Usage: arcshape init [--target <directory>] [--no-agents | --providers <ids>] [--capabilities <ids>] [--scope project|user] [--dry-run] [--yes]\n\n`,
    );
    output.write(
      `Set up arc42 documentation and optionally install ArcShape agent skills.\nExisting files are preserved and reported.\n`,
    );
    return { exitCode: 0 };
  }
  const targetRoot = resolve(process.cwd(), options.target ?? ".");
  const registry = await loadRegistry(packageRoot);
  const selection = await promptInitSelection({
    options,
    registry,
    targetRoot,
    input,
    output,
  });
  const architectureFiles = await collectFiles(
    join(packageRoot, "assets", "architecture"),
  );
  const architectureActions = [];
  for (const file of architectureFiles) {
    const destinationPath = join("docs", "architecture", file.relativePath);
    const destination = resolve(targetRoot, destinationPath);
    if (!isInside(targetRoot, destination)) {
      architectureActions.push({
        action: "conflict",
        path: destinationPath,
        reason: "resolved outside the selected target directory",
      });
      continue;
    }
    if (await hasSymlinkInPath(targetRoot, destination)) {
      architectureActions.push({
        action: "conflict",
        path: destinationPath,
        reason: "a path component is a symbolic link",
      });
      continue;
    }
    const content = await readFile(file.source);
    try {
      const existing = await readFile(destination);
      architectureActions.push(
        existing.equals(content)
          ? { action: "unchanged", path: destinationPath }
          : {
              action: "conflict",
              path: destinationPath,
              reason: "file already exists with different content",
            },
      );
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      architectureActions.push({
        action: "create",
        path: destinationPath,
        destination,
        source: file.source,
      });
    }
  }

  let agentPlan;
  if (selection.providers.length) {
    const { manifest: prior } = await readManagedState({
      targetRoot,
      scope: selection.scope,
    });
    agentPlan = await makePlan({
      packageRoot,
      targetRoot,
      providers: [
        ...new Set([...(prior?.providers ?? []), ...selection.providers]),
      ],
      capabilities: [
        ...new Set([...(prior?.capabilities ?? []), ...selection.capabilities]),
      ],
      scope: selection.scope,
      registry,
    });
  }
  output.write(`ArcShape init plan (${selection.scope} scope)\n`);
  for (const item of architectureActions)
    output.write(
      `  ${item.action.padEnd(12)} ${item.path}${item.reason ? ` — ${item.reason}` : ""}\n`,
    );
  if (agentPlan) {
    output.write(
      `Agent capabilities: ${agentPlan.providers.join(", ")} / ${agentPlan.capabilities.join(", ")}\n`,
    );
    for (const item of agentPlan.actions)
      output.write(
        `  ${item.action.padEnd(12)} ${item.path}${item.reason ? ` — ${item.reason}` : ""}\n`,
      );
    for (const warning of agentPlan.warnings ?? [])
      output.write(`  note         ${warning}\n`);
  } else output.write("Agent capabilities: skipped (CLI-only setup)\n");
  if (options.dryRun) return { exitCode: 0, architectureActions, agentPlan };
  if (
    !(await confirmPlan(options, "Apply this complete initialization plan?", {
      input,
      output,
    }))
  ) {
    output.write("Cancelled; no files were changed.\n");
    return { exitCode: 0, cancelled: true };
  }

  const written = [];
  for (const item of architectureActions) {
    if (item.action !== "create") continue;
    const destination = resolve(targetRoot, item.path);
    if (await hasSymlinkInPath(targetRoot, destination)) {
      item.action = "conflict";
      item.reason = "a path component became a symbolic link after preview";
      continue;
    }
    await mkdir(dirname(destination), { recursive: true });
    try {
      await writeFile(destination, await readFile(item.source), { flag: "wx" });
      written.push(item.path);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      item.action = "conflict";
      item.reason = "file appeared during initialization";
    }
  }
  const agentFailures = agentPlan ? await applyPlan(agentPlan) : [];
  for (const path of written) output.write(`  created ${path}\n`);
  for (const item of architectureActions.filter(
    (action) => action.action === "conflict",
  ))
    errorOutput.write(`  conflict ${item.path}: ${item.reason}\n`);
  for (const failure of agentFailures)
    errorOutput.write(`  preserved ${failure}\n`);
  return {
    exitCode:
      architectureActions.some((item) => item.action === "conflict") ||
      agentFailures.length
        ? 1
        : 0,
    written,
    architectureActions,
    agentFailures,
  };
}

function parseOptions(args) {
  const options = { dryRun: false, help: false, yes: false, noAgents: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--yes" || arg === "-y") options.yes = true;
    else if (arg === "--no-agents") options.noAgents = true;
    else if (arg === "--target" || arg === "-C")
      options.target = takeValue(args, ++index, arg);
    else if (arg === "--providers")
      options.providers = splitCsv(takeValue(args, ++index, arg));
    else if (arg === "--capabilities")
      options.capabilities = splitCsv(takeValue(args, ++index, arg));
    else if (arg === "--scope") options.scope = takeValue(args, ++index, arg);
    else throw new Error(`Unknown init option: ${arg}`);
  }
  if (options.noAgents && options.providers?.length)
    throw new Error("--no-agents and --providers cannot be used together");
  if (options.scope && !["project", "user"].includes(options.scope))
    throw new Error("Scope must be project or user");
  if (options.dryRun && options.yes)
    throw new Error("--dry-run and --yes cannot be used together");
  return options;
}

function takeValue(args, index, option) {
  const value = args[index];
  if (!value || value.startsWith("-"))
    throw new Error(`${option} requires a value`);
  return value;
}
function splitCsv(value) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
async function collectFiles(root, parent = "") {
  const entries = await readdir(join(root, parent), { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const child = join(parent, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(root, child)));
    else if (entry.isFile())
      files.push({ source: join(root, child), relativePath: child });
  }
  return files;
}
function isInside(root, path) {
  const rel = relative(root, path);
  return (
    rel === "" ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
  );
}
async function hasSymlinkInPath(root, destination) {
  const parts = relative(root, destination).split(sep);
  let current = root;
  for (const part of parts) {
    current = join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) return true;
    } catch (error) {
      if (error.code === "ENOENT") return false;
      throw error;
    }
  }
  return false;
}
