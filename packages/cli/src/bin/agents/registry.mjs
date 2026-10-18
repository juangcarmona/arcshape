import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loadRegistry(packageRoot) {
  const registryPath = join(
    packageRoot,
    "assets",
    "capabilities",
    "providers.json",
  );
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.providers))
    throw new Error("Invalid agent provider registry");

  const ids = new Set();
  for (const provider of registry.providers) {
    if (
      !provider.id ||
      ids.has(provider.id) ||
      !provider.projectSkillsRoot ||
      !provider.userSkillsRoot ||
      !Array.isArray(provider.executables) ||
      !Array.isArray(provider.markers)
    )
      throw new Error("Invalid or duplicate provider in agent registry");
    ids.add(provider.id);
  }
  return registry;
}
