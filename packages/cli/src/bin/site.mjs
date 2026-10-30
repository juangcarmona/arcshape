import { spawnSync } from "node:child_process";
import { resolve, join } from "node:path";

export async function runSite(args, { packageRoot }) {
  const options = parseOptions(args);
  if (options.help) {
    process.stdout.write(
      "Usage: arcshape site build [--docs <directory>] [--format snapshot|interactive] [--archify-deep-dives auto|off] [--out <html-file|directory>] [--title <name>] [--source-ref <ref>] [--site-base </path/>]\n       arcshape site previews [--docs <directory>] [--check]\n\n",
    );
    process.stdout.write(
      "Build a self-contained reader site from the canonical architecture Markdown.\n",
    );
    return { exitCode: 0 };
  }
  if (options.command === "previews") {
    const { generatePreviews } =
      await import("../arc42-site/native-previews.mjs");
    const count = await generatePreviews(
      resolve(process.cwd(), options.docs ?? "docs/architecture"),
      { check: options.check },
    );
    process.stdout.write(
      `${count} native preview(s) ${options.check ? "checked" : "generated"}\n`,
    );
    return { exitCode: 0 };
  }
  if (options.command !== "build") {
    throw new Error("expected `arcshape site build`; use --help for options");
  }

  const docsDir = resolve(process.cwd(), options.docs ?? "docs/architecture");
  const outFile = resolve(
    process.cwd(),
    options.out ??
      (options.format === "interactive"
        ? "docs/architecture-interactive"
        : "docs/architecture-site/index.html"),
  );
  const generator = join(packageRoot, "src", "arc42-site", "generate.mjs");
  const argv = [generator, docsDir, "--out", outFile];
  if (options.format) argv.push("--format", options.format);
  if (options.deepDives) argv.push("--archify-deep-dives", options.deepDives);
  if (options.title) argv.push("--title", options.title);
  if (options.sourceRef) argv.push("--source-ref", options.sourceRef);
  if (options.siteBase) argv.push("--site-base", options.siteBase);
  const result = spawnSync(process.execPath, argv, { stdio: "inherit" });
  if (result.error) throw result.error;
  return { exitCode: result.status ?? 1 };
}

function parseOptions(args) {
  const options = { help: false };
  let index = 0;
  if (["build", "previews"].includes(args[0])) {
    options.command = args[0];
    index = 1;
  } else if (args[0] === "--help" || args[0] === "-h") options.help = true;
  else if (args[0] !== undefined) {
    options.command = args[0];
    index = 1;
  }
  for (; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--check") options.check = true;
    else if (
      [
        "--docs",
        "--out",
        "--title",
        "--source-ref",
        "--site-base",
        "--format",
        "--archify-deep-dives",
      ].includes(arg)
    ) {
      const value = args[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`${arg} requires a value`);
      if (arg === "--docs") options.docs = value;
      if (arg === "--format") options.format = value;
      if (arg === "--archify-deep-dives") options.deepDives = value;
      if (arg === "--out") options.out = value;
      if (arg === "--title") options.title = value;
      if (arg === "--source-ref") options.sourceRef = value;
      if (arg === "--site-base") options.siteBase = value;
      index += 1;
    } else throw new Error(`unknown site option: ${arg}`);
  }
  return options;
}
