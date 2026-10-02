import { getDb, getViews, incrementViews } from "@/lib/db";
import { getPost } from "@/lib/content";
import { rateLimit, visitorId } from "@/lib/request";

export async function GET(_req: Request, ctx: RouteContext<"/api/views/[slug]">) {
  const { slug } = await ctx.params;
  if (!getPost(slug)) return Response.json({ error: "Unknown article" }, { status: 404 });
  return Response.json({ views: getViews(getDb(), slug) });
}

export async function POST(req: Request, ctx: RouteContext<"/api/views/[slug]">) {
  const { slug } = await ctx.params;
  if (!getPost(slug)) return Response.json({ error: "Unknown article" }, { status: 404 });

  // Count a visitor at most once per article every 30 minutes.
  const counted = rateLimit(`view:${slug}:${visitorId(req)}`, 1, 30 * 60_000);
  const db = getDb();
  return Response.json({ views: counted ? incrementViews(db, slug) : getViews(db, slug) });
}
