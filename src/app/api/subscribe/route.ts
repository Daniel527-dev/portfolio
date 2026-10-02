import { addSubscriber, getDb } from "@/lib/db";
import { clientIp, rateLimit, readJson } from "@/lib/request";
import { validateEmail } from "@/lib/validation";

export async function POST(req: Request) {
  if (!rateLimit(`subscribe:${clientIp(req)}`, 5, 10 * 60_000))
    return Response.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });

  const body = await readJson(req);
  if (!body) return Response.json({ error: "Invalid request body." }, { status: 400 });

  // Honeypot: real people never see or fill this field.
  if (body.company) return Response.json({ ok: true, alreadySubscribed: false });

  const email = validateEmail(body.email);
  if (!email.ok) return Response.json({ errors: email.errors }, { status: 422 });

  const isNew = addSubscriber(getDb(), email.data);
  return Response.json({ ok: true, alreadySubscribed: !isNew }, { status: isNew ? 201 : 200 });
}
