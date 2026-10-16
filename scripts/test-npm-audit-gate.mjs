import { evaluateAuditReport } from "./check-npm-audit.mjs";

const report = {
  vulnerabilities: {
    "synthetic-high-package": {
      severity: "high",
      range: "1.0.0",
      fixAvailable: false,
      via: [
        {
          title: "Synthetic high severity fixture",
          url: "https://example.invalid/GHSA-test",
        },
      ],
    },
  },
};

const evaluation = evaluateAuditReport(
  report,
  [],
  new Date("2026-10-16T00:00:00Z"),
);
if (evaluation.errors.length !== 0 || evaluation.findings.length !== 1) {
  process.stderr.write(
    "The dependency audit gate did not block the synthetic high-severity finding.\n",
  );
  process.exit(1);
}

process.stdout.write(
  "Dependency audit gate blocked the synthetic high-severity finding.\n",
);
