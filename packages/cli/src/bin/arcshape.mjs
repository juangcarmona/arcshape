#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runInit } from "./init.mjs";
import { runSite } from "./site.mjs";
import { runSession } from "./session.mjs";
import { runValidate } from "./validate.mjs";
import { runSync } from "./sync.mjs";
import { runAgents } from "./agents/commands.mjs";

const packageRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const packageJson = JSON.parse(
  await readFile(join(packageRoot, "package.json"), "utf8"),
);
const [command, ...args] = process.argv.slice(2);

if (command === "--version" || command === "-v") {
  process.stdout.write(`${packageJson.version ?? "0.0.0"}\n`);
} else if (command === "--help" || command === "-h" || command === undefined) {
  printHelp();
} else if (command === "init") {
  try {
    const result = await runInit(args, { packageRoot });
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`arcshape init: ${error.message}\n`);
    process.exitCode = 2;
  }
} else if (command === "agents") {
  try {
    const result = await runAgents(args, { packageRoot });
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`arcshape agents: ${error.message}\n`);
    process.exitCode = 2;
  }
} else if (command === "site") {
  try {
    const result = await runSite(args, { packageRoot });
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`arcshape site: ${error.message}\n`);
    process.exitCode = 2;
  }
} else if (command === "session") {
  try {
    const result = await runSession(args);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`arcshape session: ${error.message}\n`);
    process.exitCode = 2;
  }
} else if (command === "validate") {
  try {
    const result = await runValidate(args);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`arcshape validate: ${error.message}\n`);
    process.exitCode = 2;
  }
} else if (command === "sync") {
  try {
    const result = await runSync(args);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`arcshape sync: ${error.message}\n`);
    process.exitCode = 2;
  }
} else {
  process.stderr.write(`Unknown command: ${command}\n\n`);
  printHelp(process.stderr);
  process.exitCode = 2;
}

function printHelp(stream = process.stdout) {
  stream.write(`ArcShape CLI\n\n`);
  stream.write(`Usage: arcshape <command> [options]\n\n`);
  stream.write(`Commands:\n`);
  stream.write(
    `  init [--target <directory>] [--no-agents | --providers <ids>] [--capabilities <ids>] [--scope project|user] [--dry-run] [--yes]\n`,
  );
  stream.write(
    `  agents detect|list|install|update|uninstall  Manage packaged agent capabilities\n`,
  );
  stream.write(
    `  site build [--docs <directory>] [--out <file>]  Render the Markdown reader site\n`,
  );
  stream.write(
    `  validate [--docs <directory>] [--links] [--citations]  Validate docs, links, and citations\n`,
  );
  stream.write(
    `  sync obsidian|confluence [options]         Sync Markdown to Obsidian or Confluence\n`,
  );
  stream.write(
    `  session <command>                         Track evidence rounds and resume analysis\n`,
  );
  stream.write(
    `  --help, --version                        Show help or the installed version\n\n`,
  );
  stream.write(
    `Run arcshape init from any repository directory. Agent providers and capabilities are selectable.\n`,
  );
}
