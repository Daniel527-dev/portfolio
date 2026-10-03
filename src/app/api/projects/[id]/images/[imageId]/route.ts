import { revalidatePath } from "next/cache";
import { isOwner } from "@/lib/auth";
import { getDb, getProjectImage, setProjectImageCaption } from "@/lib/db";
import { removeProjectImage } from "@/lib/projects";
import { isSameOrigin, readJson } from "@/lib/request";
import { validateCaption } from "@/lib/validation";

type Ctx = RouteContext<"/api/projects/[id]/images/[imageId]">;

async function guard(req: Request, ctx: Ctx) {
  if (!isSameOrigin(req)) return { error: Response.json({ error: "Cross-site request blocked." }, { status: 403 }) };
  if (!(await isOwner())) return { error: Response.json({ error: "Sign in with Google first." }, { status: 401 }) };
  const params = await ctx.params;
  const projectId = Number(params.id);
  const id = Number(params.imageId);
  const sample = Number.isInteger(id) ? getProjectImage(getDb(), id) : undefined;
  if (!sample || sample.projectId !== projectId)
    return { error: Response.json({ error: "Image not found." }, { status: 404 }) };
  return { id };
}

function refresh() {
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function DELETE(req: Request, ctx: Ctx) {
  const g = await guard(req, ctx);
  if ("error" in g) return g.error;
  removeProjectImage(g.id);
  refresh();
  return Response.json({ ok: true });
}

// Change the caption: { caption: string }.
export async function PATCH(req: Request, ctx: Ctx) {
  const g = await guard(req, ctx);
  if ("error" in g) return g.error;
  const body = await readJson(req);
  if (typeof body?.caption !== "string") return Response.json({ error: "Send { caption: string }." }, { status: 400 });
  const caption = validateCaption(body.caption);
  if (!caption.ok) return Response.json({ errors: caption.errors }, { status: 422 });
  setProjectImageCaption(getDb(), g.id, caption.data);
  refresh();
  return Response.json({ ok: true });
}
