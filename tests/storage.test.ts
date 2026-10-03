import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, test } from "node:test";
import {
  deleteImage,
  detectImageType,
  ImageError,
  isStoredImageName,
  MAX_IMAGE_BYTES,
  mimeForStoredImage,
  readImage,
  saveImage,
} from "../src/lib/storage.ts";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-storage-test-"));
after(() => fs.rmSync(dir, { recursive: true, force: true }));

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10]);
const WEBP = new Uint8Array([...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBPVP8 ")]);

describe("detectImageType", () => {
  test("recognises images by their bytes", () => {
    assert.equal(detectImageType(PNG)?.ext, "png");
    assert.equal(detectImageType(JPEG)?.ext, "jpg");
    assert.equal(detectImageType(WEBP)?.ext, "webp");
    assert.equal(detectImageType(Buffer.from("GIF89a"))?.ext, "gif");
  });

  test("rejects non-images, whatever the file is called", () => {
    assert.equal(detectImageType(Buffer.from("<script>alert(1)</script>")), undefined);
    assert.equal(detectImageType(new Uint8Array()), undefined);
  });
});

describe("saveImage / readImage / deleteImage", () => {
  test("round-trips an image under a generated name", () => {
    const name = saveImage(dir, PNG);
    assert.match(name, /^[0-9a-f-]{36}\.png$/);
    assert.equal(mimeForStoredImage(name), "image/png");
    assert.deepEqual(new Uint8Array(readImage(dir, name)!), PNG);
    deleteImage(dir, name);
    assert.equal(readImage(dir, name), null);
  });

  test("refuses empty, oversized and non-image uploads", () => {
    assert.throws(() => saveImage(dir, new Uint8Array()), ImageError);
    assert.throws(() => saveImage(dir, Buffer.from("not an image")), ImageError);
    const big = new Uint8Array(MAX_IMAGE_BYTES + 1);
    big.set(PNG);
    assert.throws(() => saveImage(dir, big), ImageError);
  });

  test("never reads outside the uploads folder", () => {
    fs.writeFileSync(path.join(dir, "..", "portfolio-secret-test.txt"), "secret");
    try {
      for (const name of ["../portfolio-secret-test.txt", "..\\portfolio-secret-test.txt", "a/b.png", "x.svg", ".png"]) {
        assert.equal(isStoredImageName(name), false, name);
        assert.equal(readImage(dir, name), null);
      }
    } finally {
      fs.rmSync(path.join(dir, "..", "portfolio-secret-test.txt"), { force: true });
    }
  });
});
