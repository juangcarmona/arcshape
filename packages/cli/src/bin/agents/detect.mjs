import { access, constants, stat } from "node:fs/promises";
import { delimiter, join } from "node:path";

export async function detectProviders(registry, targetRoot, env = process.env) {
  const detected = [];
  const ambiguous = [];
  const pathEntries = (env.PATH ?? "").split(delimiter).filter(Boolean);
  const extensions =
    process.platform === "win32"
      ? (env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";")
      : [""];

  for (const provider of registry.providers) {
    const evidence = [];
    for (const executable of provider.executables) {
      for (const directory of pathEntries) {
        for (const extension of extensions) {
          const candidate = join(directory, `${executable}${extension}`);
          try {
            await access(candidate, constants.X_OK);
            const info = await stat(candidate);
            if (info.isFile())
              evidence.push({
                kind: "path-executable",
                strength: "strong",
                value: executable,
              });
          } catch {
            // Presence checks intentionally avoid launching provider processes.
          }
          if (evidence.some((item) => item.value === executable)) break;
        }
        if (evidence.some((item) => item.value === executable)) break;
      }
    }
    for (const marker of provider.markers) {
      try {
        await access(join(targetRoot, marker));
        evidence.push({
          kind: "repository-marker",
          strength: "weak",
          value: marker,
        });
      } catch {
        // Missing markers are expected.
      }
    }
    if (evidence.length) detected.push({ ...provider, evidence });
  }

  try {
    await access(join(targetRoot, ".agents", "skills"));
    ambiguous.push({
      kind: "shared-skills-root",
      value: ".agents/skills",
      message:
        "This shared path is used by multiple agents and does not identify a provider.",
    });
  } catch {
    // No shared root to report.
  }
  return { detected, ambiguous };
}
