// Generates the PWA/apple-touch icons without any image dependencies.
// Run with: node scripts/generate-icons.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(root, "public/icons");

const COLORS = {
  background: [3, 7, 18, 255],
  ocean: [11, 41, 66, 255],
  cyan: [6, 182, 212, 255],
  sky: [56, 189, 248, 220],
  glow: [6, 182, 212, 90]
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function circleCoverage(x, y, cx, cy, radius, feather = 1.25) {
  const distance = Math.hypot(x - cx, y - cy);
  return clamp01((radius + feather - distance) / feather);
}

function ringCoverage(x, y, cx, cy, radius, thickness, feather = 1.25) {
  const distance = Math.abs(Math.hypot(x - cx, y - cy) - radius);
  return clamp01((thickness / 2 + feather - distance) / feather);
}

function ellipseCoverage(x, y, cx, cy, rx, ry, thickness, feather = 1.25) {
  // Approximate distance to an axis-aligned ellipse by sampling the implicit form.
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  const value = Math.sqrt(nx * nx + ny * ny);
  const scale = Math.min(rx, ry);
  return clamp01((thickness / 2 + feather - Math.abs(value - 1) * scale) / feather);
}

function blend(target, color, coverage, opacity = 1) {
  const alpha = clamp01(coverage) * opacity * (color[3] / 255);
  if (alpha <= 0) return;
  target[0] = Math.round(target[0] * (1 - alpha) + color[0] * alpha);
  target[1] = Math.round(target[1] * (1 - alpha) + color[1] * alpha);
  target[2] = Math.round(target[2] * (1 - alpha) + color[2] * alpha);
  target[3] = 255;
}

function renderIcon(size, { maskable = false } = {}) {
  const pixels = Buffer.alloc(size * size * 4);
  const center = size / 2;
  // Maskable icons must keep artwork inside the 80% safe zone.
  const scale = maskable ? 0.78 : 1;
  const outer = size * 0.4 * scale;
  const inner = size * 0.3 * scale;
  const core = size * 0.14 * scale;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const offset = (y * size + x) * 4;
      const color = [...COLORS.background];
      const distance = Math.hypot(x - center, y - center);

      // Subtle radial sheen behind the emblem.
      const sheen = clamp01(1 - distance / (size * 0.62)) * 0.35;
      blend(color, COLORS.ocean, 1, sheen);

      blend(color, COLORS.glow, circleCoverage(x, y, center, center, outer * 1.16));
      blend(color, COLORS.ocean, circleCoverage(x, y, center, center, outer));
      blend(color, COLORS.cyan, ringCoverage(x, y, center, center, outer, size * 0.028 * scale));

      // Equator and meridian lines.
      blend(color, COLORS.sky, ellipseCoverage(x, y, center, center, outer * 0.96, outer * 0.3, size * 0.008));
      blend(color, COLORS.sky, ellipseCoverage(x, y, center, center, outer * 0.3, outer * 0.96, size * 0.008));
      blend(color, COLORS.cyan, ringCoverage(x, y, center, center, inner, size * 0.01 * scale), 0.8);

      blend(color, COLORS.cyan, circleCoverage(x, y, center, center, core));
      blend(color, [255, 255, 255, 255], circleCoverage(x, y, center - core * 0.25, center - core * 0.25, core * 0.42), 0.55);

      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
      pixels[offset + 3] = 255;
    }
  }

  return encodePng(size, size, pixels);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(width, height, rgbaPixels) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgbaPixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

mkdirSync(outputDir, { recursive: true });

const targets = [
  ["icon-192.png", 192, {}],
  ["icon-512.png", 512, {}],
  ["icon-maskable-512.png", 512, { maskable: true }],
  ["apple-touch-icon.png", 180, {}]
];

for (const [name, size, options] of targets) {
  const png = renderIcon(size, options);
  writeFileSync(resolve(outputDir, name), png);
  console.log(`wrote public/icons/${name} (${png.length} bytes)`);
}
