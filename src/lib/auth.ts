import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Single-owner admin login. The password lives in ADMIN_PASSWORD; the session
// cookie holds an HMAC of a fixed label, so it can't be forged without SESSION_SECRET
// and every session is invalidated when the secret changes.

export const SESSION_COOKIE = "admin_session";
const SECRET = process.env.SESSION_SECRET ?? "dev-only-secret-change-me";

function sessionToken() {
  return createHmac("sha256", SECRET).update("admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(candidate, expected!);
}

export async function isAdmin() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return Boolean(value) && safeEqual(value!, sessionToken());
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
