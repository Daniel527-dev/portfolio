import { authConfigured, googleClientId, ownerEmail, startSession } from "@/lib/auth";
import { verifyGoogleCredential } from "@/lib/google-auth";
import { clientIp, isSameOrigin, rateLimit, readJson } from "@/lib/request";

const MESSAGES = {
  invalid: "Google sign-in failed. Please try again.",
  unverified: "That Google account's email isn't verified.",
  "not-owner": "This Google account isn't allowed to manage the site.",
} as const;

// Exchanges a Google Identity Services credential for an owner session cookie.
export async function POST(req: Request) {
  if (!authConfigured())
    return Response.json({ error: "Owner sign-in isn't configured on this server." }, { status: 503 });
  if (!isSameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  if (!rateLimit(`google-login:${clientIp(req)}`, 10, 15 * 60_000))
    return Response.json({ error: "Too many sign-in attempts. Try again later." }, { status: 429 });

  const body = await readJson(req);
  const credential = typeof body?.credential === "string" ? body.credential : "";
  const result = await verifyGoogleCredential(credential, { clientId: googleClientId()!, owner: ownerEmail()! });
  if (!result.ok)
    return Response.json({ error: MESSAGES[result.reason] }, { status: result.reason === "invalid" ? 401 : 403 });

  await startSession(result.email);
  return Response.json({ ok: true, email: result.email });
}
