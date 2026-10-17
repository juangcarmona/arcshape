import { createHash, randomUUID } from "node:crypto";
import {
  lstat,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

const CAPABILITIES = ["arc-adr", "arc-architecture", "arc-c4", "arc-docs-sync"];
const LEGACY_FILENAME = "legacy-v0.1.1.json";
const PROVIDER_IDS = new Set([
  "codex",
  "claude",
  "cursor",
  "windsurf",
  "gemini",
  "opencode",
  "copilot",
]);

export function validCapabilityIds(values) {
  if (!values?.length) return [...CAPABILITIES];
  const unique = [...new Set(values)];
  const invalid = unique.filter((value) => !CAPABILITIES.includes(value));
  if (invalid.length)
    throw new Error(`Unknown capability: ${invalid.join(", ")}`);
  return unique;
}

export function validProviderIds(registry, values) {
  const unique = [...new Set(values ?? [])];
  const allowed = new Set(registry.providers.map(({ id }) => id));
  const invalid = unique.filter((value) => !allowed.has(value));
  if (invalid.length)
    throw new Error(`Unknown provider: ${invalid.join(", ")}`);
  return unique;
}

export async function makePlan({
  packageRoot,
  targetRoot,
  userRoot = homedir(),
  providers,
  capabilities,
  scope,
  registry,
  operation = "install",
  includeLegacy = true,
}) {
  if (!providers.length && operation !== "uninstall")
    throw new Error("Select at least one provider");
  if (!new Set(["project", "user"]).has(scope))
    throw new Error("Scope must be project or user");

  const installRoot =
    scope === "user" ? resolve(userRoot) : resolve(targetRoot);
  const manifestPath =
    scope === "user"
      ? join(installRoot, ".arcshape", "agent-capabilities.json")
      : join(installRoot, ".arcshape", "agent-capabilities.json");
  const manifestRelative =
    scope === "project" ? relative(installRoot, manifestPath) : manifestPath;
  const current = await readManifest(manifestPath, scope, installRoot);
  const selectedCapabilities =
    operation === "uninstall"
      ? (current?.capabilities ?? [])
      : validCapabilityIds(capabilities);
  const roots = new Set();
  for (const id of providers) {
    const provider = registry.providers.find((item) => item.id === id);
    if (!provider) throw new Error(`Unknown provider: ${id}`);
    roots.add(
      scope === "user" ? provider.userSkillsRoot : provider.projectSkillsRoot,
    );
  }

  const desired = new Map();
  if (operation !== "uninstall") {
    for (const root of roots) {
      for (const capability of selectedCapabilities) {
        const relativePath = `${root}/${capability}/SKILL.md`;
        desired.set(
          relativePath,
          join(packageRoot, "capabilities", "skills", capability, "SKILL.md"),
        );
      }
    }
  }

  const managed = current?.files ?? {};
  const actions = [];
  for (const [relativePath, source] of desired) {
    const destination =
      scope === "project"
        ? resolve(installRoot, relativePath)
        : resolve(installRoot, relativePath);
    const priorHash = managed[relativePath];
    const sourceContent = await readFile(source);
    const sourceHash = hash(sourceContent);
    const state = await inspectDestination(installRoot, destination, scope);
    if (!state.exists) {
      actions.push({
        action: "create",
        path: relativePath,
        destination,
        source,
        hash: sourceHash,
      });
    } else if (!priorHash) {
      actions.push({
        action: "conflict",
        path: relativePath,
        destination,
        reason: "existing file is not managed by ArcShape",
      });
    } else if (state.hash !== priorHash) {
      actions.push({
        action: "preserve",
        path: relativePath,
        destination,
        reason: "managed file was edited",
      });
    } else if (state.hash === sourceHash) {
      actions.push({
        action: "unchanged",
        path: relativePath,
        destination,
        hash: sourceHash,
      });
    } else {
      actions.push({
        action: "update",
        path: relativePath,
        destination,
        source,
        hash: sourceHash,
        priorHash,
      });
    }
  }

  for (const [relativePath, priorHash] of Object.entries(managed)) {
    if (desired.has(relativePath)) continue;
    const destination = resolve(installRoot, relativePath);
    const state = await inspectDestination(installRoot, destination, scope);
    if (!state.exists) continue;
    actions.push(
      state.hash === priorHash
        ? { action: "remove", path: relativePath, destination, priorHash }
        : {
            action: "preserve",
            path: relativePath,
            destination,
            reason: "managed file was edited",
          },
    );
  }

  if (includeLegacy && operation !== "list") {
    const legacy = JSON.parse(
      await readFile(
        join(packageRoot, "capabilities", LEGACY_FILENAME),
        "utf8",
      ),
    );
    for (const [legacyPath, expectedHash] of Object.entries(legacy.files)) {
      const destination = resolve(installRoot, legacyPath);
      const state = await inspectDestination(installRoot, destination, scope);
      if (state.exists)
        actions.push(
          state.hash === expectedHash
            ? {
                action: "remove-legacy",
                path: legacyPath,
                destination,
                priorHash: expectedHash,
              }
            : {
                action: "preserve",
                path: legacyPath,
                destination,
                reason: "legacy file differs from the published 0.1.1 content",
              },
        );
    }
  }

  const manifest = {
    schemaVersion: 1,
    packageVersion: JSON.parse(
      await readFile(join(packageRoot, "package.json"), "utf8"),
    ).version,
    scope,
    providers: operation === "uninstall" ? [] : providers,
    capabilities: operation === "uninstall" ? [] : selectedCapabilities,
    files: {},
  };
  for (const path of desired.keys()) {
    const action = actions.find((item) => item.path === path);
    if (action?.hash) manifest.files[path] = action.hash;
    else if (managed[path]) manifest.files[path] = managed[path];
    else if (action?.action === "preserve") continue;
  }
  for (const [path, digest] of Object.entries(managed)) {
    if (!desired.has(path)) {
      const action = actions.find((item) => item.path === path);
      if (action?.action === "preserve") manifest.files[path] = digest;
    }
  }

  return {
    scope,
    providers,
    capabilities: selectedCapabilities,
    operation,
    installRoot,
    manifestPath,
    manifestRelative,
    manifest,
    actions,
    warnings:
      providers.includes("claude") && providers.some((id) => id !== "claude")
        ? [
            "Claude Code and shared-path providers may discover duplicate copies of the same skill; provider behavior varies.",
          ]
        : [],
  };
}

export async function applyPlan(plan) {
  const failures = [];
  for (const item of plan.actions) {
    if (item.action === "conflict") {
      failures.push(`${item.path}: ${item.reason}`);
      continue;
    }
    if (["preserve", "unchanged"].includes(item.action)) continue;
    const state = await inspectDestination(
      plan.installRoot,
      item.destination,
      plan.scope,
    );
    if (item.action === "create" && state.exists) {
      delete plan.manifest.files[item.path];
      failures.push(
        `${item.path}: appeared during installation; left unchanged`,
      );
      continue;
    }
    if (["update", "remove", "remove-legacy"].includes(item.action)) {
      if (!state.exists || state.hash !== item.priorHash) {
        if (item.action === "update" || item.action === "remove")
          plan.manifest.files[item.path] = item.priorHash;
        failures.push(`${item.path}: changed after preview; left unchanged`);
        continue;
      }
    }
    if (item.action === "remove" || item.action === "remove-legacy") {
      await rm(item.destination);
      continue;
    }
    const content = await readFile(item.source);
    await mkdir(dirname(item.destination), { recursive: true });
    const rechecked = await inspectDestination(
      plan.installRoot,
      item.destination,
      plan.scope,
    );
    if (item.action === "create" && rechecked.exists) {
      delete plan.manifest.files[item.path];
      failures.push(
        `${item.path}: appeared after parent creation; left unchanged`,
      );
      continue;
    }
    if (
      item.action === "update" &&
      (!rechecked.exists || rechecked.hash !== item.priorHash)
    ) {
      plan.manifest.files[item.path] = item.priorHash;
      failures.push(
        `${item.path}: changed after parent creation; left unchanged`,
      );
      continue;
    }
    await atomicWrite(item.destination, content, item.action === "create");
  }

  const manifestDestination = plan.manifestPath;
  const initialManifest = await inspectDestination(
    plan.installRoot,
    manifestDestination,
    plan.scope,
  );
  if (
    plan.operation === "uninstall" &&
    !Object.keys(plan.manifest.files).length
  ) {
    await rm(manifestDestination, { force: true });
  } else {
    const bytes = Buffer.from(`${JSON.stringify(plan.manifest, null, 2)}\n`);
    await mkdir(dirname(manifestDestination), { recursive: true });
    const currentManifest = await inspectDestination(
      plan.installRoot,
      manifestDestination,
      plan.scope,
    );
    if (
      initialManifest.exists !== currentManifest.exists ||
      (initialManifest.exists && initialManifest.hash !== currentManifest.hash)
    )
      throw new Error(
        "Capability manifest changed after preview; no manifest update was written",
      );
    await atomicWrite(manifestDestination, bytes, !currentManifest.exists);
  }
  return failures;
}

export async function readManagedState({
  targetRoot,
  userRoot = homedir(),
  scope,
}) {
  const root = scope === "user" ? resolve(userRoot) : resolve(targetRoot);
  const manifestPath =
    scope === "user"
      ? join(root, ".arcshape", "agent-capabilities.json")
      : join(root, ".arcshape", "agent-capabilities.json");
  const manifest = await readManifest(manifestPath, scope, root);
  return { manifestPath, manifest };
}

async function readManifest(path, scope, root) {
  if (!(await inspectDestination(root, path, scope)).exists) return null;
  try {
    const manifest = JSON.parse(await readFile(path, "utf8"));
    if (
      manifest.schemaVersion !== 1 ||
      typeof manifest.packageVersion !== "string" ||
      manifest.scope !== scope ||
      !Array.isArray(manifest.providers) ||
      !Array.isArray(manifest.capabilities) ||
      !manifest.files ||
      typeof manifest.files !== "object" ||
      Array.isArray(manifest.files)
    )
      throw new Error("manifest has an unsupported or malformed schema");
    if (
      manifest.providers.some((id) => !PROVIDER_IDS.has(id)) ||
      manifest.capabilities.some((id) => !CAPABILITIES.includes(id))
    )
      throw new Error("manifest contains an unknown provider or capability");
    for (const [filePath, digest] of Object.entries(manifest.files)) {
      if (typeof digest !== "string" || !/^[a-f0-9]{64}$/.test(digest))
        throw new Error(`manifest has an invalid hash for ${filePath}`);
      const portablePath = filePath.replaceAll("\\", "/");
      const match = portablePath.match(
        /^(\.agents\/skills|\.claude\/skills)\/(arc-[a-z0-9-]+)\/SKILL\.md$/,
      );
      if (!match || !CAPABILITIES.includes(match[2]))
        throw new Error(
          `manifest contains an unsupported managed path: ${filePath}`,
        );
      const fullPath = resolve(root, filePath.replaceAll("\\", sep));
      const rel = relative(root, fullPath);
      if (isAbsolute(rel) || rel === ".." || rel.startsWith(`..${sep}`))
        throw new Error(`manifest path escapes scope: ${filePath}`);
    }
    return manifest;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(
      `Cannot read ArcShape capability manifest: ${error.message}`,
    );
  }
}

async function inspectDestination(root, destination, scope) {
  try {
    const rootInfo = await lstat(root);
    if (rootInfo.isSymbolicLink())
      throw new Error(`Refusing symbolic link install root: ${root}`);
    if (!rootInfo.isDirectory())
      throw new Error(`Install root is not a directory: ${root}`);
  } catch (error) {
    if (error.code === "ENOENT") return { exists: false };
    throw error;
  }
  const rel = relative(root, destination);
  if (isAbsolute(rel) || rel === ".." || rel.startsWith(`..${sep}`))
    throw new Error(
      `Destination escapes ${scope} install root: ${destination}`,
    );
  let current = root;
  for (const part of rel.split(sep)) {
    current = join(current, part);
    try {
      const info = await lstat(current);
      if (info.isSymbolicLink())
        throw new Error(
          `Refusing symbolic link in destination path: ${current}`,
        );
    } catch (error) {
      if (error.code === "ENOENT") return { exists: false };
      throw error;
    }
  }
  try {
    const info = await stat(destination);
    if (!info.isFile())
      throw new Error(`Destination is not a regular file: ${destination}`);
    return { exists: true, hash: hash(await readFile(destination)) };
  } catch (error) {
    if (error.code === "ENOENT") return { exists: false };
    throw error;
  }
}

async function atomicWrite(destination, content, exclusive) {
  const temporary = `${destination}.${randomUUID()}.tmp`;
  await writeFile(temporary, content, { flag: "wx" });
  try {
    if (exclusive) {
      // A hard link gives create operations no-clobber semantics on the same filesystem.
      const { link } = await import("node:fs/promises");
      await link(temporary, destination);
      await rm(temporary);
    } else {
      await rename(temporary, destination);
    }
  } catch (error) {
    await rm(temporary, { force: true });
    if (error.code === "EEXIST")
      throw new Error(
        `Destination appeared during installation: ${destination}`,
      );
    throw error;
  }
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

export const knownCapabilities = CAPABILITIES;
