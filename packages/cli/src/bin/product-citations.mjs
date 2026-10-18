import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { access } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

export async function verifyProductCitations({
  repositoryRoot,
  docsDir,
  productShapeCliPath,
}) {
  const modelRoot = resolve(repositoryRoot, "docs", "product", "model");
  try {
    await access(modelRoot);
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        status: "skipped",
        reason: "No docs/product/model directory was found.",
        citations: [],
        diagnostics: [],
        summary: { total: 0 },
      };
    }
    throw error;
  }

  const cliPath = productShapeCliPath ?? findProductShapeCli(repositoryRoot);
  if (!cliPath) {
    return {
      status: "unavailable",
      reason:
        "A ProductShape model is present, but @prodshape/cli is not installed in this repository. Install it or run `prodshape citations verify` directly.",
      citations: [],
      diagnostics: [],
      summary: { total: 0 },
    };
  }

  const relativeDocsDir = relative(repositoryRoot, docsDir);
  const target =
    relativeDocsDir === "" ||
    (!isAbsolute(relativeDocsDir) &&
      relativeDocsDir !== ".." &&
      !relativeDocsDir.startsWith(`..${sep}`))
      ? relativeDocsDir || "."
      : docsDir;
  const result = spawnSync(
    process.execPath,
    [
      cliPath,
      "citations",
      "verify",
      target,
      "--root",
      repositoryRoot,
      "--format",
      "json",
    ],
    { cwd: repositoryRoot, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );

  if (result.error) {
    return {
      status: "unavailable",
      reason: `Could not run ProductShape citation verification: ${result.error.message}`,
      citations: [],
      diagnostics: [],
      summary: { total: 0 },
    };
  }

  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    return {
      status: "invalid",
      reason:
        result.stderr?.trim() ||
        "ProductShape citation verification did not return valid JSON.",
      citations: [],
      diagnostics: [],
      summary: { total: 0 },
    };
  }

  return {
    status: result.status === 0 ? "verified" : "invalid",
    reason:
      result.status === 0 ? undefined : result.stderr?.trim() || undefined,
    citations: report.citations ?? [],
    diagnostics: report.diagnostics ?? [],
    summary: report.summary ?? { total: report.citations?.length ?? 0 },
  };
}

function findProductShapeCli(repositoryRoot) {
  try {
    const require = createRequire(resolve(repositoryRoot, "package.json"));
    return require.resolve("@prodshape/cli/dist/bin.js");
  } catch {
    return undefined;
  }
}
