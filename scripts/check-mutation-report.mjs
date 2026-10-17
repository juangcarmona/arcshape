import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const selfTestOnly = args.length === 1 && args[0] === "--self-test";
const reportPath = selfTestOnly ? undefined : args[0];

if (selfTestOnly) {
  let rejectedZeroTestsMutant = false;
  try {
    validateReport(syntheticReport());
  } catch (error) {
    if (error.message.includes("0 tests")) rejectedZeroTestsMutant = true;
    else throw error;
  }
  if (!rejectedZeroTestsMutant)
    throw new Error("synthetic zero-tests mutant unexpectedly passed");
  validateReport(syntheticReport({ testsCompleted: 1 }));
  process.stdout.write(
    "Mutation-report self-test passed (covered mutant with zero tests is rejected).\n",
  );
} else if (!reportPath) {
  process.stderr.write(
    "Usage: node scripts/check-mutation-report.mjs <stryker-json-report> [--self-test]\n",
  );
  process.exitCode = 2;
} else {
  try {
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    const summary = validateReport(report);
    process.stdout.write(
      `Stryker report verified: ${summary.total} mutants; ${summary.killed} killed, ${summary.survived} survived, ${summary.noCoverage} without coverage; ${summary.executedTests} total test executions.\n`,
    );
  } catch (error) {
    process.stderr.write(
      `Invalid Stryker mutation evidence: ${error.message}\n`,
    );
    process.exitCode = 1;
  }
}

function validateReport(report) {
  if (!report || typeof report.files !== "object" || !report.files)
    throw new Error("report has no files object");

  const summary = {
    total: 0,
    killed: 0,
    survived: 0,
    noCoverage: 0,
    executedTests: 0,
  };
  for (const file of Object.values(report.files)) {
    if (!file || typeof file.mutants !== "object" || !file.mutants)
      throw new Error("file entry has no mutants object");
    for (const mutant of Object.values(file.mutants)) {
      if (!Array.isArray(mutant.coveredBy))
        throw new Error(`missing coverage metadata for mutant ${mutant.id}`);
      if (
        mutant.coveredBy.length > 0 &&
        mutant.status === "Survived" &&
        (!Number.isInteger(mutant.testsCompleted) ||
          mutant.testsCompleted === 0)
      )
        throw new Error(
          `covered mutant ${mutant.id} ran 0 tests; refusing a false mutation score`,
        );
      summary.total += 1;
      summary.executedTests += Number.isInteger(mutant.testsCompleted)
        ? mutant.testsCompleted
        : 0;
      if (mutant.status === "Killed") summary.killed += 1;
      else if (mutant.status === "Survived") summary.survived += 1;
      else if (mutant.status === "NoCoverage") summary.noCoverage += 1;
    }
  }
  if (summary.total === 0) throw new Error("report contains no mutants");
  if (summary.killed === 0)
    throw new Error(
      "report contains no killed mutants; gate self-check is missing",
    );
  return summary;
}

function syntheticReport({ testsCompleted = 0 } = {}) {
  return {
    files: {
      "fixture.mjs": {
        mutants: {
          1: {
            id: "1",
            status: "Survived",
            testsCompleted,
            coveredBy: ["test 1"],
          },
          2: {
            id: "2",
            status: "Killed",
            testsCompleted: 1,
            coveredBy: ["test 1"],
          },
        },
      },
    },
  };
}
