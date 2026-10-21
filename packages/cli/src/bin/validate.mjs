import { isAbsolute, relative, resolve, sep } from "node:path";
import { loadDocs } from "../arc42-site/loadDocs.mjs";
import { verifyProductCitations } from "./product-citations.mjs";
import { validateMarkdownLinks } from "./validate-links.mjs";

export async function runValidate(args, runtime = {}) {
  const options = parseOptions(args);
  if (options.help) {
    process.stdout.write(
      "Usage: arcshape validate [--docs <directory>] [--links] [--citations] [--format text|json]\n\n",
    );
    process.stdout.write(
      "Validate the navigation README, twelve arc42 section documents, and supporting Markdown. Use --links to check local links and --citations to verify ProductShape citations when a model is present.\n",
    );
    return { exitCode: 0 };
  }

  const workingDirectory = resolve(runtime.cwd ?? process.cwd());
  const docsDir = resolve(
    workingDirectory,
    options.docs ?? "docs/architecture",
  );
  const docsRelativeToWorkingDirectory = relative(workingDirectory, docsDir);
  const repositoryRoot =
    isAbsolute(docsRelativeToWorkingDirectory) ||
    docsRelativeToWorkingDirectory === ".." ||
    docsRelativeToWorkingDirectory.startsWith(`..${sep}`)
      ? docsDir
      : workingDirectory;
  try {
    const docs = await loadDocs(docsDir);
    const documents = [
      docs.readme,
      ...docs.sections.flatMap((section) => [section, ...section.supporting]),
    ];
    const diagnostics = options.links
      ? await validateMarkdownLinks(documents, repositoryRoot, docsDir)
      : [];
    const productCitations = options.citations
      ? await verifyProductCitations({
          repositoryRoot: workingDirectory,
          docsDir,
          productShapeCliPath: runtime.productShapeCliPath,
        })
      : undefined;
    const result = {
      valid:
        diagnostics.length === 0 &&
        productCitations?.status !== "invalid" &&
        productCitations?.status !== "unavailable",
      docs: docsDir,
      sections: docs.sections.length,
      title: docs.readme.title,
      diagnostics,
      ...(productCitations ? { productCitations } : {}),
    };
    printResult(result, options.format);
    return { exitCode: result.valid ? 0 : 1, result };
  } catch (error) {
    const problems = error.problems ?? [error.message];
    const result = {
      valid: false,
      docs: docsDir,
      sections: 0,
      diagnostics: problems,
    };
    printResult(result, options.format);
    return { exitCode: 1, result };
  }
}

function printResult(result, format) {
  if (format === "json") {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if (result.valid) {
    process.stdout.write(
      `Valid arc42 documentation: ${result.sections} sections (${result.docs})\n`,
    );
  } else {
    process.stderr.write(`Invalid arc42 documentation (${result.docs}):\n`);
    for (const diagnostic of result.diagnostics)
      process.stderr.write(`  - ${diagnostic}\n`);
  }
  if (result.productCitations?.status === "skipped")
    process.stdout.write(
      `ProductShape citations skipped: ${result.productCitations.reason}\n`,
    );
  else if (result.productCitations?.status === "verified")
    process.stdout.write(
      `ProductShape citations verified: ${result.productCitations.summary.total} citation(s)\n`,
    );
  else if (result.productCitations) {
    process.stderr.write(
      `ProductShape citation verification ${result.productCitations.status}: ${result.productCitations.reason ?? "see diagnostics"}\n`,
    );
  }
  for (const diagnostic of result.productCitations?.diagnostics ?? []) {
    const write =
      diagnostic.severity === "warning" ? process.stdout : process.stderr;
    write.write(
      `  - ${diagnostic.severity ?? "error"} ${diagnostic.code ?? ""} ${diagnostic.file ?? ""}: ${diagnostic.message ?? JSON.stringify(diagnostic)}\n`,
    );
  }
}

function parseOptions(args) {
  const options = { format: "text", help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--links") options.links = true;
    else if (arg === "--citations") options.citations = true;
    else if (arg === "--docs" || arg === "--format") {
      const value = args[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`${arg} requires a value`);
      if (arg === "--docs") options.docs = value;
      else if (value === "text" || value === "json") options.format = value;
      else throw new Error("--format must be text or json");
      index += 1;
    } else throw new Error(`Unknown validate option: ${arg}`);
  }
  return options;
}
