import { describe, expect, it } from "vitest";
import { crc32, deflateSync } from "node:zlib";
import {
  bundlePng,
  pngProvenance,
  rasterDimensions,
} from "../packages/cli/src/arc42-site/native-png.mjs";
import { contentHash } from "../packages/cli/src/arc42-site/bundle-format.mjs";

function chunk(type, data) {
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length);
  out.write(type, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, -4)), out.length - 4);
  return out;
}
const header = Buffer.from("00000001000000010806000000", "hex");
const png = Buffer.concat([
  Buffer.from("89504e470d0a1a0a", "hex"),
  chunk("IHDR", header),
  chunk("IDAT", deflateSync(Buffer.from([0, 255, 255, 255, 255]))),
  chunk("IEND", Buffer.alloc(0)),
]);

describe("portable PNG integrity", () => {
  it("records source, vector and content provenance in standard PNG metadata", () => {
    const bundled = bundlePng(png, "source", "svg");
    expect(bundled.subarray(0, 8)).toEqual(png.subarray(0, 8));
    expect(pngProvenance(bundled)).toEqual({
      source: contentHash("source"),
      svg: contentHash("svg"),
      content: contentHash(png),
    });
    expect(bundled.readUInt32BE(16)).toBe(1);
    for (let offset = 8; offset < bundled.length;) {
      const end = offset + bundled.readUInt32BE(offset) + 12;
      expect(bundled.readUInt32BE(end - 4)).toBe(
        crc32(bundled.subarray(offset + 4, end - 4)),
      );
      offset = end;
    }
    expect(() => bundlePng(bundled, "source", "svg")).toThrow(
      "already has provenance",
    );
  });
  it("rejects authored, modified, truncated and trailing output", () => {
    expect(pngProvenance(png)).toBeUndefined();
    expect(pngProvenance(undefined)).toBeUndefined();
    const bundled = bundlePng(png, "source", "svg");
    const modified = Buffer.from(bundled);
    modified[50] ^= 1;
    for (const bad of [
      modified,
      bundled.subarray(0, 40),
      Buffer.concat([bundled, Buffer.from("edited")]),
      Buffer.from("not PNG"),
    ])
      expect(pngProvenance(bad)).toBeUndefined();
    expect(() => bundlePng(Buffer.from("bad"), "source", "svg")).toThrow();
  });
  it("bounds raster dimensions without changing ordinary 2x output", () => {
    expect(rasterDimensions(800, 500)).toEqual({ width: 1600, height: 1000 });
    for (const [width, height] of [
      [20000, 20000],
      [20000, 500],
      [500, 20000],
    ]) {
      const size = rasterDimensions(width, height);
      expect(size.width).toBeLessThanOrEqual(8192);
      expect(size.height).toBeLessThanOrEqual(8192);
      expect(size.width * size.height).toBeLessThanOrEqual(16_000_000);
    }
    for (const width of [0, -1, NaN, Infinity])
      expect(() => rasterDimensions(width, 500)).toThrow();
    const oversizedHeader = Buffer.from(header);
    oversizedHeader.writeUInt32BE(9000);
    const oversized = Buffer.concat([
      png.subarray(0, 8),
      chunk("IHDR", oversizedHeader),
      png.subarray(33),
    ]);
    expect(() => bundlePng(oversized, "source", "svg")).toThrow(
      "raster limits",
    );
  });
});
