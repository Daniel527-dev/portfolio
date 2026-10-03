import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Project images are stored as files next to the database; the DB row only
// keeps the generated file name. The type is detected from the file's first
// bytes, never from the browser-supplied name or MIME type.

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const SIGNATURES: { ext: string; mime: string; test: (b: Uint8Array) => boolean }[] = [
  { ext: "png", mime: "image/png", test: (b) => hex(b, 0, 4) === "89504e47" },
  { ext: "jpg", mime: "image/jpeg", test: (b) => hex(b, 0, 3) === "ffd8ff" },
  { ext: "gif", mime: "image/gif", test: (b) => ascii(b, 0, 4) === "GIF8" },
  { ext: "webp", mime: "image/webp", test: (b) => ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP" },
  { ext: "avif", mime: "image/avif", test: (b) => ascii(b, 4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(b, 8, 12)) },
];

function hex(b: Uint8Array, start: number, end: number) {
  return Buffer.from(b.subarray(start, end)).toString("hex");
}
function ascii(b: Uint8Array, start: number, end: number) {
  return Buffer.from(b.subarray(start, end)).toString("latin1");
}

export function detectImageType(bytes: Uint8Array) {
  return SIGNATURES.find((s) => s.test(bytes));
}

const FILE_RE = /^[a-z0-9-]+\.(png|jpg|gif|webp|avif)$/;

export function isStoredImageName(name: string) {
  return FILE_RE.test(name);
}

export function mimeForStoredImage(name: string) {
  const ext = name.split(".").pop();
  return SIGNATURES.find((s) => s.ext === ext)?.mime ?? "application/octet-stream";
}

/** Validates and writes an image; returns the generated file name. */
export function saveImage(dir: string, bytes: Uint8Array) {
  if (bytes.byteLength === 0) throw new ImageError("The image file is empty.");
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new ImageError("Images must be 8 MB or smaller.");
  const type = detectImageType(bytes);
  if (!type) throw new ImageError("Only PNG, JPEG, WebP, GIF or AVIF images are supported.");
  fs.mkdirSync(dir, { recursive: true });
  const name = `${randomUUID()}.${type.ext}`;
  fs.writeFileSync(path.join(/*turbopackIgnore: true*/ dir, name), bytes);
  return name;
}

export function readImage(dir: string, name: string) {
  if (!isStoredImageName(name)) return null;
  try {
    return fs.readFileSync(path.join(/*turbopackIgnore: true*/ dir, name));
  } catch {
    return null;
  }
}

export function deleteImage(dir: string, name: string) {
  if (isStoredImageName(name)) fs.rmSync(path.join(/*turbopackIgnore: true*/ dir, name), { force: true });
}

export class ImageError extends Error {}
