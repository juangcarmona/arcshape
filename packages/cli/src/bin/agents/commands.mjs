import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { resolve } from "node:path";
import { detectProviders } from "./detect.mjs";
import { loadRegistry } from "./registry.mjs";
import {
  applyPlan,
  knownCapabilities,
  makePlan,
  readManagedState,
  validCapabilityIds,
  validProviderIds,
} from "./lifecycle.mjs";

export async function runAgents(
  args,
  { packageRoot, input = stdin, output = stdout },
) {
  const [operation = "", ...rest] = args;
  if (operation === "--help" || operation === "-h") {
    printAgentsHelp(output);
    return { exitCode: 0 };
  }
  if (
    !["detect", "list", "install", "update", "uninstall"].includes(operation)
  ) {
    printAgentsHelp(output);
    return { exitCode: operation ? 2 : 0 };
  }
  const options = parseOptions(rest);
  const registry = await loadRegistry(packageRoot);
  const targetRoot = resolve(process.cwd(), options.target ?? ".");
  if (operation === "detect") {
    const result = await detectProviders(registry, targetRoot);
    for (const provider of result.detected)
      output.write(
        `${provider.id}: detected (${provider.evidence.map(({ value, strength }) => `${value}, ${strength}`).join("; ")})\n`,
      );
    if (!result.detected.length)
      output.write("No supported agent provider detected.\n");
    for (const item of result.ambiguous)
      output.write(`ambiguous: ${item.value} (${item.message})\n`);
    return { exitCode: 0, ...result };
  }
  if (operation === "list") {
    const { manifest } = await readManagedState({
      packageRoot,
      targetRoot,
      scope: options.scope ?? "project",
    });
    if (!manifest)
      output.write("No ArcShape-managed agent capabilities found.\n");
    else output.write(`${JSON.stringify(manifest, null, 2)}\n`);
    return { exitCode: 0, manifest };
  }

  const scope = options.scope ?? "project";
  const prior = await readManagedState({ packageRoot, targetRoot, scope });
  const selectedProviders =
    operation === "uninstall"
      ? (prior.manifest?.providers ?? [])
      : options.providers
        ? [
            ...new Set([
              ...(prior.manifest?.providers ?? []),
              ...validProviderIds(registry, options.providers),
            ]),
          ]
        : (prior.manifest?.providers ?? []);
  let chosenProviders = selectedProviders;
  let chosenCapabilities =
    operation === "uninstall"
      ? (prior.manifest?.capabilities ?? [])
      : options.capabilities
        ? [
            ...new Set([
              ...(prior.manifest?.capabilities ?? []),
              ...validCapabilityIds(options.capabilities),
            ]),
          ]
        : (prior.manifest?.capabilities ?? knownCapabilities);
  let selectedScope = scope;
  if (!chosenProviders.length && operation !== "uninstall") {
    if (!input.isTTY || !output.isTTY)
      throw new Error(
        "Non-interactive installation requires --providers <ids>",
      );
    const selection = await promptInitSelection({
      options: {
        providers: options.providers,
        capabilities: options.capabilities,
        scope: options.scope,
      },
      registry,
      targetRoot,
      input,
      output,
    });
    chosenProviders = selection.providers;
    chosenCapabilities = selection.capabilities;
    selectedScope = selection.scope;
  }
  if (!chosenProviders.length && operation !== "uninstall") {
    output.write("No provider selected; no files were changed.\n");
    return { exitCode: 0, cancelled: true };
  }
  if (operation === "uninstall" && !prior.manifest) {
    output.write(`No ArcShape-managed capabilities in ${scope} scope.\n`);
    return { exitCode: 0 };
  }
  const plan = await makePlan({
    packageRoot,
    targetRoot,
    providers: chosenProviders,
    capabilities: chosenCapabilities,
    scope: selectedScope,
    registry,
    operation,
  });
  displayPlan(plan, output);
  if (options.dryRun) return { exitCode: 0, plan };
  if (
    !(await confirmPlan(options, `${operation} these capabilities?`, {
      input,
      output,
    }))
  ) {
    output.write("Cancelled; no files were changed.\n");
    return { exitCode: 0, cancelled: true };
  }
  const failures = await applyPlan(plan);
  for (const failure of failures) output.write(`preserved ${failure}\n`);
  output.write(
    `Completed ${operation} for ${plan.capabilities.length} capability(s).\n`,
  );
  return { exitCode: failures.length ? 1 : 0, failures, plan };
}

export async function promptInitSelection({
  options,
  registry,
  targetRoot,
  input = stdin,
  output = stdout,
}) {
  if (options.noAgents)
    return { providers: [], capabilities: [], scope: "project" };
  if (options.providers?.length) {
    return {
      providers: validProviderIds(registry, options.providers),
      capabilities: validCapabilityIds(options.capabilities),
      scope: options.scope ?? "project",
    };
  }
  const detection = await detectProviders(registry, targetRoot);
  if (!input.isTTY || !output.isTTY) {
    if (!options.providers?.length)
      throw new Error(
        "Non-interactive init requires --providers <ids> or --no-agents",
      );
    return {
      providers: validProviderIds(registry, options.providers),
      capabilities: validCapabilityIds(options.capabilities),
      scope: options.scope ?? "project",
    };
  }

  const rl = createInterface({ input, output });
  try {
    const suggested = detection.detected.map(({ id }) => id).join(",");
    const providerText = await rl.question(
      `Detected providers: ${suggested || "none"}. Select provider IDs (comma-separated), or leave blank for CLI only: `,
    );
    const providers = validProviderIds(registry, splitCsv(providerText));
    if (!providers.length)
      return { providers: [], capabilities: [], scope: "project" };
    const capabilityText = await rl.question(
      `Capabilities (${knownCapabilities.join(",")}): `,
    );
    const capabilities = validCapabilityIds(splitCsv(capabilityText));
    const scopeText = await rl.question(
      "Install scope [project/user] (project): ",
    );
    const scope = scopeText.trim() || "project";
    if (!["project", "user"].includes(scope))
      throw new Error("Scope must be project or user");
    return { providers, capabilities, scope };
  } finally {
    rl.close();
  }
}

export async function confirmPlan(
  options,
  question,
  { input = stdin, output = stdout } = {},
) {
  if (options.yes) return true;
  if (!input.isTTY || !output.isTTY)
    throw new Error(
      "Non-interactive installation requires --yes after reviewing the plan",
    );
  const rl = createInterface({ input, output });
  try {
    return (
      (await rl.question(`${question} [y/N] `)).trim().toLowerCase() === "y"
    );
  } finally {
    rl.close();
  }
}

function displayPlan(plan, output) {
  output.write(
    `Plan: ${plan.operation} ${plan.capabilities.join(", ")} for ${plan.providers.join(", ")} (${plan.scope} scope)\n`,
  );
  for (const item of plan.actions)
    output.write(
      `  ${item.action.padEnd(12)} ${item.path}${item.reason ? ` — ${item.reason}` : ""}\n`,
    );
  for (const warning of plan.warnings ?? [])
    output.write(`  note         ${warning}\n`);
  if (!plan.actions.length) output.write("  no file changes\n");
}

function parseOptions(args) {
  const options = {
    providers: undefined,
    capabilities: undefined,
    dryRun: false,
    yes: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--yes" || arg === "-y") options.yes = true;
    else if (["--target", "-C"].includes(arg))
      options.target = takeValue(args, ++index, arg);
    else if (arg === "--scope") options.scope = takeValue(args, ++index, arg);
    else if (arg === "--providers")
      options.providers = splitCsv(takeValue(args, ++index, arg));
    else if (arg === "--capabilities")
      options.capabilities = splitCsv(takeValue(args, ++index, arg));
    else throw new Error(`Unknown agents option: ${arg}`);
  }
  if (options.dryRun && options.yes)
    throw new Error("--dry-run and --yes cannot be used together");
  if (options.scope && !["project", "user"].includes(options.scope))
    throw new Error("Scope must be project or user");
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
function printAgentsHelp(output = stdout) {
  output.write(
    `Usage: arcshape agents <detect|list|install|update|uninstall> [options]\n\n`,
  );
  output.write(
    `Options: --providers <ids> --capabilities <ids> --scope project|user --target <dir> --dry-run --yes\n`,
  );
  output.write(
    `Providers: codex,claude,cursor,windsurf,gemini,opencode,copilot\n`,
  );
  output.write(`Capabilities: arc-adr,arc-architecture,arc-c4,arc-docs-sync\n`);
}
