import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { validateContact, validateEmail, validateProject } from "../src/lib/validation.ts";

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
