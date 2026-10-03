import { createHmac, timingSafeEqual } from "node:crypto";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

// Owner-only sign-in without an account system: Google proves who you are,
// and only the single address in OWNER_EMAIL is let in. Nothing is stored
// server-side; the session is an HMAC-signed cookie.

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const googleKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export type VerifyResult =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid" | "unverified" | "not-owner" };

/** Verifies a Google Identity Services ID token and checks it belongs to the owner. */
export async function verifyGoogleCredential(
  credential: string,
  opts: { clientId: string; owner: string; keys?: JWTVerifyGetKey },
): Promise<VerifyResult> {
  try {
    const { payload } = await jwtVerify(credential, opts.keys ?? googleKeys, {
      issuer: GOOGLE_ISSUERS,
      audience: opts.clientId,
    });
    if (payload.email_verified !== true) return { ok: false, reason: "unverified" };
    const email = String(payload.email ?? "").toLowerCase();
    if (!email || email !== opts.owner.toLowerCase()) return { ok: false, reason: "not-owner" };
    return { ok: true, email };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

/* ---------- session token: base64url(email).expiresAt.signature ---------- */

function sign(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(email: string, secret: string, expiresAt: number) {
  const data = `${Buffer.from(email).toString("base64url")}.${expiresAt}`;
  return `${data}.${sign(data, secret)}`;
}

/** True only for an unexpired, correctly signed token issued to the current owner. */
export function verifySessionToken(
  token: string | undefined,
  owner: string | null,
  secret: string,
  now = Date.now(),
) {
  if (!token || !owner) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [emailPart, expiresPart, signature] = parts;
  const expected = Buffer.from(sign(`${emailPart}.${expiresPart}`, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  if (!(Number(expiresPart) > now)) return false;
  return Buffer.from(emailPart, "base64url").toString() === owner.toLowerCase();
}
