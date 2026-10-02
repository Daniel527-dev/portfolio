import { addLikes, getDb, getLikes } from "@/lib/db";
import { getPost } from "@/lib/content";
import { rateLimit, readJson, visitorId } from "@/lib/request";

async function resolveSlug(ctx: RouteContext<"/api/likes/[slug]">) {
  const { slug } = await ctx.params;
  return getPost(slug) ? slug : null;
}

export async function GET(req: Request, ctx: RouteContext<"/api/likes/[slug]">) {
  const slug = await resolveSlug(ctx);
  if (!slug) return Response.json({ error: "Unknown article" }, { status: 404 });
  return Response.json(getLikes(getDb(), slug, visitorId(req)));
}

export async function POST(req: Request, ctx: RouteContext<"/api/likes/[slug]">) {
  const slug = await resolveSlug(ctx);
  if (!slug) return Response.json({ error: "Unknown article" }, { status: 404 });

  const visitor = visitorId(req);
  if (!rateLimit(`like:${visitor}`, 30, 60_000))
    return Response.json({ error: "Easy there! Too many likes at once." }, { status: 429 });

  // The client batches rapid clicks into one request, so accept a small count.
  const body = await readJson(req);
  const amount = typeof body?.amount === "number" ? body.amount : 1;
  return Response.json(addLikes(getDb(), slug, visitor, amount));
}
