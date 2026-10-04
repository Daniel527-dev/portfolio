import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  validateCaption,
  validateContact,
  validateEmail,
  validateGalleryImage,
  validateProject,
} from "../src/lib/validation.ts";

describe("validateEmail", () => {
  test("normalises valid addresses", () => {
    assert.deepEqual(validateEmail("  Hello@Example.COM "), { ok: true, data: "hello@example.com" });
  });

  test("rejects missing and malformed addresses", () => {
    for (const bad of [undefined, "", "nope", "a@b", "a b@c.com", 42]) {
      const result = validateEmail(bad);
      assert.equal(result.ok, false, `expected ${String(bad)} to be rejected`);
    }
  });
});

describe("validateContact", () => {
  test("accepts a complete message", () => {
    const result = validateContact({ name: " Sam ", email: "sam@example.com", message: "Hello there, nice site!" });
    assert.deepEqual(result, {
      ok: true,
      data: { name: "Sam", email: "sam@example.com", body: "Hello there, nice site!" },
    });
  });

  test("reports every invalid field at once", () => {
    const result = validateContact({ name: "", email: "bad", message: "short" });
    assert.equal(result.ok, false);
    if (!result.ok) assert.deepEqual(Object.keys(result.errors).sort(), ["email", "message", "name"]);
  });
});

describe("validateProject", () => {
  const now = new Date("2026-10-03");

  test("cleans up a valid project", () => {
    const result = validateProject(
      { title: "  Brand refresh ", summary: "New logo and website.", year: "2025", tags: "Figma, , Branding ", featured: "on" },
      now,
    );
    assert.deepEqual(result, {
      ok: true,
      data: { title: "Brand refresh", summary: "New logo and website.", year: 2025, tags: ["Figma", "Branding"], featured: true },
    });
  });

  test("reports each invalid field", () => {
    const result = validateProject({ title: "", summary: "short", year: "2099", tags: "a,b,c,d,e,f,g,h,i" }, now);
    assert.equal(result.ok, false);
    if (!result.ok) assert.deepEqual(Object.keys(result.errors).sort(), ["summary", "tags", "title", "year"]);
  });
});

describe("validateCaption", () => {
  test("trims and collapses whitespace; empty is allowed", () => {
    assert.deepEqual(validateCaption("  Token   sheet\n for brands "), { ok: true, data: "Token sheet for brands" });
    assert.deepEqual(validateCaption(undefined), { ok: true, data: "" });
  });

  test("rejects captions over 160 characters", () => {
    const result = validateCaption("x".repeat(161));
    assert.equal(result.ok, false);
  });
});

describe("validateGalleryImage", () => {
  test("own samples need no credit and drop any that is sent", () => {
    assert.deepEqual(validateGalleryImage({ caption: "Mine", credit: "ignored" }), {
      ok: true,
      data: { caption: "Mine", kind: "sample", credit: "", sourceUrl: "" },
    });
  });

  test("references require a credit and an http(s) link", () => {
    const missing = validateGalleryImage({ kind: "reference", caption: "x" });
    assert.equal(missing.ok, false);
    assert.ok(!missing.ok && missing.errors.credit && missing.errors.sourceUrl);
    const badUrl = validateGalleryImage({ kind: "reference", credit: "Studio", sourceUrl: "javascript:alert(1)" });
    assert.ok(!badUrl.ok && badUrl.errors.sourceUrl);
    assert.deepEqual(validateGalleryImage({ kind: "reference", credit: " Studio ", sourceUrl: "https://studio.test/work" }), {
      ok: true,
      data: { caption: "", kind: "reference", credit: "Studio", sourceUrl: "https://studio.test/work" },
    });
  });
});
