import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "./google-auth";

// Cookie session for the site owner, who signs in with Google (see
// google-auth.ts). Configure with OWNER_EMAIL, GOOGLE_CLIENT_ID and SESSION_SECRET.

export const SESSION_COOKIE = "owner_session";
const SESSION_HOURS = 8;
const SECRET = process.env.SESSION_SECRET ?? "dev-only-secret-change-me";

export function ownerEmail() {
  return process.env.OWNER_EMAIL?.trim().toLowerCase() || null;
}

export function googleClientId() {
  return process.env.GOOGLE_CLIENT_ID?.trim() || null;
}

export function authConfigured() {
  return Boolean(ownerEmail() && googleClientId());
}

export async function isOwner() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, ownerEmail(), SECRET);
}

export async function startSession(email: string) {
  const maxAge = SESSION_HOURS * 60 * 60;
  (await cookies()).set(SESSION_COOKIE, createSessionToken(email, SECRET, Date.now() + maxAge * 1000), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
