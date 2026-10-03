import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type CryptoKey, type JWTVerifyGetKey } from "jose";
import { createSessionToken, verifyGoogleCredential, verifySessionToken } from "../src/lib/google-auth.ts";

const CLIENT_ID = "test-client.apps.googleusercontent.com";
const OWNER = "owner@gmail.com";
let privateKey: CryptoKey;
let keys: JWTVerifyGetKey;

// Stand-in for Google's signing keys, so the real verification code runs offline.
before(async () => {
  const pair = await generateKeyPair("RS256");
  privateKey = pair.privateKey;
  keys = createLocalJWKSet({ keys: [{ ...(await exportJWK(pair.publicKey)), kid: "test", alg: "RS256" }] });
});

function googleToken(claims: Record<string, unknown>, opts: { aud?: string; iss?: string; exp?: string } = {}) {
  return new SignJWT({ email: OWNER, email_verified: true, ...claims })
    .setProtectedHeader({ alg: "RS256", kid: "test" })
    .setIssuer(opts.iss ?? "https://accounts.google.com")
    .setAudience(opts.aud ?? CLIENT_ID)
    .setIssuedAt()
    .setExpirationTime(opts.exp ?? "1h")
    .sign(privateKey);
}

const verify = (token: string) => verifyGoogleCredential(token, { clientId: CLIENT_ID, owner: OWNER, keys });

describe("verifyGoogleCredential", () => {
  test("accepts the owner's verified account (case-insensitive)", async () => {
    assert.deepEqual(await verify(await googleToken({ email: "Owner@Gmail.com" })), { ok: true, email: OWNER });
  });

  test("refuses other accounts and unverified emails", async () => {
    assert.deepEqual(await verify(await googleToken({ email: "someone@gmail.com" })), { ok: false, reason: "not-owner" });
    assert.deepEqual(await verify(await googleToken({ email_verified: false })), { ok: false, reason: "unverified" });
  });

  test("refuses tokens for another app or issuer, expired or tampered", async () => {
    const good = await googleToken({});
    for (const token of [
      await googleToken({}, { aud: "other-app" }),
      await googleToken({}, { iss: "https://evil.example" }),
      await googleToken({}, { exp: "-1m" }),
      good.slice(0, -4) + (good.endsWith("AAAA") ? "BBBB" : "AAAA"),
      "not-a-jwt",
    ]) {
      assert.deepEqual(await verify(token), { ok: false, reason: "invalid" });
    }
  });
});

describe("session tokens", () => {
  const secret = "test-secret";
  const now = Date.now();

  test("valid for the owner until they expire", () => {
    const token = createSessionToken(OWNER, secret, now + 60_000);
    assert.equal(verifySessionToken(token, OWNER, secret, now), true);
    assert.equal(verifySessionToken(token, OWNER, secret, now + 120_000), false);
  });

  test("invalid with another secret, another owner or a forged email", () => {
    const token = createSessionToken(OWNER, secret, now + 60_000);
    assert.equal(verifySessionToken(token, OWNER, "other-secret", now), false);
    assert.equal(verifySessionToken(token, "new-owner@gmail.com", secret, now), false);
    const [, exp, sig] = token.split(".");
    const forged = `${Buffer.from("attacker@gmail.com").toString("base64url")}.${exp}.${sig}`;
    assert.equal(verifySessionToken(forged, "attacker@gmail.com", secret, now), false);
    assert.equal(verifySessionToken(undefined, OWNER, secret, now), false);
    assert.equal(verifySessionToken(token, null, secret, now), false);
  });
});
