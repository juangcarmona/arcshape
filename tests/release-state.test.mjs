import { describe, expect, it } from "vitest";
import {
  classifyReleaseState,
  compareVersions,
  parsePublishedVersions,
  readPublishedVersions,
} from "../scripts/check-release-state.mjs";

describe("release state", () => {
  it("orders stable versions", () => {
    expect(compareVersions("0.1.2", "0.1.1")).toBe(1);
    expect(compareVersions("0.1.2", "0.1.2")).toBe(0);
    expect(compareVersions("0.1.1", "0.1.2")).toBe(-1);
  });

  it("classifies a version that npm has not published", () => {
    expect(classifyReleaseState("@arcshape/cli", "0.1.2", ["0.1.1"])).toEqual({
      packageName: "@arcshape/cli",
      packageVersion: "0.1.2",
      state: "pending",
    });
  });

  it("classifies an immutable version already on npm", () => {
    expect(
      classifyReleaseState("@arcshape/cli", "0.1.2", ["0.1.1", "0.1.2"]),
    ).toEqual({
      packageName: "@arcshape/cli",
      packageVersion: "0.1.2",
      state: "already-published",
    });
  });

  it("refuses an npm-ahead repository state", () => {
    expect(
      classifyReleaseState("@arcshape/cli", "0.1.2", ["0.1.3"]),
    ).toMatchObject({
      packageName: "@arcshape/cli",
      packageVersion: "0.1.2",
      state: "inconsistent",
      newerVersion: "0.1.3",
    });
  });

  it("rejects malformed registry data", () => {
    expect(() => parsePublishedVersions({ versions: ["0.1.2"] })).toThrow(
      "invalid version list",
    );
    expect(() => parsePublishedVersions(["not-a-version"])).toThrow(
      "invalid version list",
    );
    expect(() => parsePublishedVersions(["01.0.0"])).toThrow(
      "invalid version list",
    );
    expect(() => parsePublishedVersions(["1.2.3-01"])).toThrow(
      "invalid version list",
    );
  });

  it("ignores valid prereleases when comparing stable versions", () => {
    expect(parsePublishedVersions(["0.0.0-stage", "0.1.0", "0.1.1"])).toEqual([
      "0.1.0",
      "0.1.1",
    ]);
    expect(
      classifyReleaseState("@arcshape/cli", "0.1.2", [
        "0.0.0-stage",
        "0.1.0",
        "0.1.1",
      ]),
    ).toEqual({
      packageName: "@arcshape/cli",
      packageVersion: "0.1.2",
      state: "pending",
    });
  });

  it("treats an unclaimed package as pending", async () => {
    await expect(
      readPublishedVersions("@arcshape/cli", async () => {
        const error = new Error("not found");
        error.stderr = "npm ERR! code E404";
        throw error;
      }),
    ).resolves.toEqual([]);
  });
});
