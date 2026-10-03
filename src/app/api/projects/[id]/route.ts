import { revalidatePath } from "next/cache";
import { isOwner } from "@/lib/auth";
import { getDb, getProject, setProjectFeatured } from "@/lib/db";
import { removeProject } from "@/lib/projects";
import { isSameOrigin, readJson } from "@/lib/request";

async function guard(req: Request, ctx: RouteContext<"/api/projects/[id]">) {
  if (!isSameOrigin(req)) return { error: Response.json({ error: "Cross-site request blocked." }, { status: 403 }) };
  if (!(await isOwner())) return { error: Response.json({ error: "Sign in with Google first." }, { status: 401 }) };
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || !getProject(getDb(), id))
    return { error: Response.json({ error: "Project not found." }, { status: 404 }) };
  return { id };
}

function refresh() {
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/projects/[id]">) {
  const g = await guard(req, ctx);
  if ("error" in g) return g.error;
  removeProject(g.id);
  refresh();
  return Response.json({ ok: true });
}

// Toggle whether the project appears in "Selected Projects" on the home page.
export async function PATCH(req: Request, ctx: RouteContext<"/api/projects/[id]">) {
  const g = await guard(req, ctx);
  if ("error" in g) return g.error;
  const body = await readJson(req);
  if (typeof body?.featured !== "boolean")
    return Response.json({ error: "Send { featured: true | false }." }, { status: 400 });
  setProjectFeatured(getDb(), g.id, body.featured);
  refresh();
  return Response.json({ ok: true });
}
