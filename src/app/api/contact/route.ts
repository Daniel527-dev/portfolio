import { addMessage, getDb } from "@/lib/db";
import { forwardContactMessage } from "@/lib/mail";
import { clientIp, rateLimit, readJson } from "@/lib/request";
import { validateContact } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return Response.json({ error: "Invalid request body." }, { status: 400 });
  if (body.company) return Response.json({ ok: true }, { status: 201 });

  const result = validateContact(body);
  if (!result.ok) return Response.json({ errors: result.errors }, { status: 422 });

  // Only messages that would actually be stored count toward the limit,
  // so fixing a typo in the form never locks anyone out.
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000))
    return Response.json({ error: "You've sent a few messages already. Try again later." }, { status: 429 });

  // Store first so nothing is lost if the email provider is down or misconfigured,
  // then forward. The owner can also read messages at /admin.
  const id = addMessage(getDb(), result.data);
  const forwarded = await forwardContactMessage(result.data);
  if (!forwarded.ok && forwarded.reason !== "unconfigured") {
    console.warn("[contact] failed to forward message", id, forwarded);
  }
  return Response.json({ ok: true, id }, { status: 201 });
}
