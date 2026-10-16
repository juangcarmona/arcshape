import { resolve } from "node:path";
import { loadDocs } from "../tools/arc42-site/loadDocs.mjs";

export async function runValidate(args) {
  const options = parseOptions(args);
  if (options.help) {
    process.stdout.write(
      "Usage: arcshape validate [--docs <directory>] [--format text|json]\n\n",
    );
    process.stdout.write(
      "Validate the README and all twelve Markdown arc42 sections.\n",
    );
    return { exitCode: 0 };
  }

  const docsDir = resolve(process.cwd(), options.docs ?? "docs/architecture");
  try {
    const docs = await loadDocs(docsDir);
    const result = {
      valid: true,
      docs: docsDir,
      sections: docs.sections.length,
      title: docs.readme.title,
      diagnostics: [],
    };
    printResult(result, options.format);
    return { exitCode: 0, result };
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
}

function parseOptions(args) {
  const options = { format: "text", help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
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
