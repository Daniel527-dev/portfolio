import { endSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/request";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  await endSession();
  return Response.json({ ok: true });
}
