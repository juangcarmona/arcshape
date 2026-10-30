import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { buildNativeViewer } from "../packages/cli/src/arc42-site/native-viewer.mjs";

describe("native viewer SVG serialization", () => {
  it("separates path coordinates without changing numbers, labels or script content", () => {
    const coordinates =
      "M 674 232 Q 674 240 666 240 L 650 240 M -1.5 +2.5 L .5 1e2";
    const script = 'window.example = "674 240 666 240";';
    const html = buildNativeViewer({
      title: "Coordinates",
      svg: "<svg></svg>",
      html: `<html><head></head><body><svg><path d="${coordinates}"></path><text>674 240 666 240</text></svg><script>${script}</script></body></html>`,
    });
    const outer = new JSDOM(html);
    const { html: runtime } = JSON.parse(
      outer.window.document.getElementById("viewer-data").textContent,
    );
    const inner = new JSDOM(runtime);
    const path = inner.window.document.querySelector("path").getAttribute("d");
    expect(path).toBe(
      "M 674,232 Q 674,240,666,240 L 650,240 M -1.5,+2.5 L .5,1e2",
    );
    expect(path.split(/[,\s]+/)).toEqual(coordinates.split(/\s+/));
    expect(inner.window.document.querySelector("text").textContent).toBe(
      "674 240 666 240",
    );
    expect(
      [...inner.window.document.scripts].some((s) => s.textContent === script),
    ).toBe(true);
    outer.window.close();
    inner.window.close();
  });
});
