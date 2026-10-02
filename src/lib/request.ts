import { createHash } from "node:crypto";

// Helpers for identifying visitors without storing anything personal:
// the IP + user agent are hashed with a server secret before they touch the DB.

const SALT = process.env.SESSION_SECRET ?? "dev-only-secret-change-me";

export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

export function visitorId(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  return createHash("sha256").update(`${SALT}|${clientIp(req)}|${ua}`).digest("hex").slice(0, 32);
}

// Fixed-window rate limiter kept in memory. Good enough for a single
// server; swap for Redis/Upstash if you scale out to several instances.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}
