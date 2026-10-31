import { contentHash } from "./bundle-format.mjs";

// Retain Node 22.0 compatibility, including releases without zlib.crc32.
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++)
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes)
    value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

const signature = Buffer.from("89504e470d0a1a0a", "hex");
const keyword = Buffer.from("ArcShape\0");
export const maxPngBytes = 16 * 1024 * 1024;

export function rasterDimensions(width, height) {
  if (![width, height].every((n) => Number.isFinite(n) && n > 0))
    throw new Error("invalid native raster dimensions");
  const scale = Math.min(
    2,
    8192 / width,
    8192 / height,
    Math.sqrt(16_000_000 / (width * height)),
  );
  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
  };
}

function inspectPng(png) {
  if (
    !Buffer.isBuffer(png) ||
    png.length > maxPngBytes ||
    !png.subarray(0, 8).equals(signature)
  )
    throw new Error("invalid or oversized PNG");
  const original = [signature];
  let metadata,
    end,
    offset = 8,
    chunks = 0;
  while (offset < png.length) {
    if (offset + 12 > png.length) throw new Error("truncated PNG chunk");
    const length = png.readUInt32BE(offset),
      next = offset + length + 12;
    if (next > png.length) throw new Error("truncated PNG data");
    const type = png.toString("ascii", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, next - 4);
    if (
      crc32(png.subarray(offset + 4, next - 4)) !== png.readUInt32BE(next - 4)
    )
      throw new Error("PNG chunk checksum mismatch");
    if (chunks++ === 0) {
      if (type !== "IHDR" || length !== 13)
        throw new Error("missing PNG header");
      const width = data.readUInt32BE(0),
        height = data.readUInt32BE(4);
      if (
        !width ||
        !height ||
        width > 8192 ||
        height > 8192 ||
        width * height > 16_000_000
      )
        throw new Error("PNG exceeds raster limits");
    }
    if (type === "tEXt" && data.subarray(0, keyword.length).equals(keyword)) {
      if (metadata || length > 1024) throw new Error("invalid PNG provenance");
      metadata = JSON.parse(data.subarray(keyword.length).toString("utf8"));
    } else original.push(png.subarray(offset, next));
    if (type === "IEND") {
      if (length !== 0 || next !== png.length)
        throw new Error("invalid PNG end");
      end = offset;
      break;
    }
    offset = next;
  }
  if (end === undefined) throw new Error("missing PNG end");
  return { metadata, original: Buffer.concat(original), end };
}

export function bundlePng(png, source, svg) {
  const { metadata, end } = inspectPng(png);
  if (metadata) throw new Error("PNG already has provenance");
  const payload = Buffer.concat([
    keyword,
    Buffer.from(
      JSON.stringify({
        source: contentHash(source),
        svg: contentHash(svg),
        content: contentHash(png),
      }),
    ),
  ]);
  const chunk = Buffer.alloc(payload.length + 12);
  chunk.writeUInt32BE(payload.length);
  chunk.write("tEXt", 4);
  payload.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, -4)), chunk.length - 4);
  const output = Buffer.concat([
    png.subarray(0, end),
    chunk,
    png.subarray(end),
  ]);
  if (output.length > maxPngBytes)
    throw new Error("generated PNG exceeds 16 MiB");
  return output;
}

export function pngProvenance(png) {
  try {
    const { metadata, original } = inspectPng(png);
    if (
      !metadata ||
      ![metadata.source, metadata.svg, metadata.content].every(
        (v) => typeof v === "string" && /^[a-f0-9]{64}$/.test(v),
      ) ||
      metadata.content !== contentHash(original)
    )
      return undefined;
    return metadata;
  } catch {
    return undefined;
  }
}
