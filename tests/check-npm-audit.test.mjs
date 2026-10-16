import { describe, expect, it } from "vitest";
import { evaluateAuditReport } from "../scripts/check-npm-audit.mjs";

const now = new Date("2026-10-16T12:00:00Z");

describe("evaluateAuditReport", () => {
  it("blocks high and critical findings but allows lower severities", () => {
    const report = {
      vulnerabilities: {
        moderate: { severity: "moderate", via: [] },
        high: {
          severity: "high",
          range: "1.0.0",
          fixAvailable: false,
          via: [{ title: "High", url: "https://example.invalid/high" }],
        },
        critical: {
          severity: "critical",
          range: "2.0.0",
          fixAvailable: true,
          via: [{ title: "Critical", url: "https://example.invalid/critical" }],
        },
      },
    };

    expect(
      evaluateAuditReport(report, [], now).findings.map(
        ({ severity }) => severity,
      ),
    ).toEqual(["high", "critical"]);
  });

  it("requires scoped exceptions to have owners, reasons, and unexpired dates", () => {
    const report = {
      vulnerabilities: {
        package: {
          severity: "high",
          via: [{ title: "High", url: "https://example.invalid/advisory" }],
        },
      },
    };
    const exception = {
      package: "package",
      advisory: "https://example.invalid/advisory",
      reason: "Upstream fix pending",
      owner: "maintainer",
      expiresOn: "2026-10-31",
    };

    expect(evaluateAuditReport(report, [exception], now)).toEqual({
      errors: [],
      findings: [],
    });
    expect(
      evaluateAuditReport(
        report,
        [{ ...exception, expiresOn: "2026-10-01" }],
        now,
      ).errors,
    ).toContain(
      "Expired exception for package:https://example.invalid/advisory; remove it or renew it through review.",
    );
  });

  it("rejects invalid calendar dates, duplicate exceptions, and unmatched exceptions", () => {
    const exception = {
      package: "package",
      advisory: "https://example.invalid/advisory",
      reason: "Upstream fix pending",
      owner: "maintainer",
      expiresOn: "2026-10-31",
    };

    expect(
      evaluateAuditReport(
        { vulnerabilities: {} },
        [{ ...exception, expiresOn: "2026-02-31" }],
        now,
      ).errors,
    ).toContain(
      "Each exception must specify package, advisory, reason, owner, and ISO expiry date.",
    );
    expect(
      evaluateAuditReport({ vulnerabilities: {} }, [exception, exception], now)
        .errors,
    ).toContain(
      "Duplicate exception for package:https://example.invalid/advisory.",
    );
    expect(
      evaluateAuditReport({ vulnerabilities: {} }, [exception], now).errors,
    ).toContain(
      "Stale or unmatched exception for package (https://example.invalid/advisory); remove it or verify the advisory mapping.",
    );
  });

  it("resolves advisories through npm's transitive dependency paths", () => {
    const report = {
      vulnerabilities: {
        consumer: { severity: "high", via: ["wrapper"] },
        wrapper: { severity: "high", via: ["braces"] },
        braces: {
          severity: "high",
          via: [
            {
              title: "Stack exhaustion",
              url: "https://example.invalid/braces",
            },
          ],
        },
      },
    };

    expect(evaluateAuditReport(report, [], now).findings).toHaveLength(3);
    expect(
      evaluateAuditReport(
        report,
        [
          {
            package: "consumer",
            advisory: "https://example.invalid/braces",
            reason: "Upstream fix pending",
            owner: "maintainer",
            expiresOn: "2026-10-31",
          },
        ],
        now,
      ).findings.map(({ package: name }) => name),
    ).toEqual(["wrapper", "braces"]);
  });

  it("fails closed when npm returns no vulnerability report", () => {
    expect(
      evaluateAuditReport({ message: "registry unavailable" }, [], now).errors,
    ).toHaveLength(1);
  });
});
