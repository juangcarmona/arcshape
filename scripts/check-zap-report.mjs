import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const selfTestOnly = args.length === 1 && args[0] === "--self-test";
const reportPath = selfTestOnly ? undefined : args[0];
if (selfTestOnly) {
  selfTest();
} else if (!reportPath) {
  process.stderr.write(
    "Usage: node scripts/check-zap-report.mjs <zap-json-report> [--self-test]\n",
  );
  process.exitCode = 2;
} else {
  try {
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    const alerts = collectAlerts(report);
    const high = alerts.filter((alert) => riskCode(alert) >= 3);
    const byRisk = new Map();
    for (const alert of alerts) {
      const risk = ["Informational", "Low", "Medium", "High"][riskCode(alert)];
      byRisk.set(risk, (byRisk.get(risk) ?? 0) + 1);
    }
    process.stdout.write(
      `ZAP passive scan: ${alerts.length} alert(s); ${
        [...byRisk].map(([risk, count]) => `${risk}: ${count}`).join(", ") ||
        "no alerts"
      }\n`,
    );
    if (high.length) {
      process.stderr.write(
        `Blocking High-risk ZAP alert(s):\n${high
          .map(
            (alert) =>
              `- ${alert.name ?? alert.alert}: ${alert.url ?? "(no URL)"}`,
          )
          .join("\n")}\n`,
      );
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`Unable to evaluate ZAP report: ${error.message}\n`);
    process.exitCode = 2;
  }
}

function collectAlerts(report) {
  if (!Array.isArray(report.site)) throw new Error("report has no site array");
  return report.site.flatMap((site) => {
    if (!Array.isArray(site.alerts))
      throw new Error("site entry has no alerts array");
    return site.alerts;
  });
}

function riskCode(alert) {
  const value = Number(alert.riskcode);
  if (!Number.isInteger(value) || value < 0 || value > 3)
    throw new Error(`invalid riskcode in alert: ${alert.name ?? alert.alert}`);
  return value;
}

function selfTest() {
  const report = (riskcode) => ({
    site: [{ alerts: [{ name: "Synthetic finding", riskcode }] }],
  });
  if (collectAlerts(report("2")).some((alert) => riskCode(alert) >= 3))
    throw new Error("synthetic Medium finding should remain informational");
  if (!collectAlerts(report("3")).some((alert) => riskCode(alert) >= 3))
    throw new Error("synthetic High finding did not reach the blocking policy");
  process.stdout.write(
    "ZAP severity-policy self-test passed (Medium reports; High blocks).\n",
  );
}
