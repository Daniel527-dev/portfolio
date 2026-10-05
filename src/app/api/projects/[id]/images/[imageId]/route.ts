import { revalidatePath } from "next/cache";
import { isOwner } from "@/lib/auth";
import { getDb, getProjectImage, setProjectImageCaption, setProjectImageCredit } from "@/lib/db";
import { removeProjectImage } from "@/lib/projects";
import { isSameOrigin, readJson } from "@/lib/request";
import { validateGalleryImage } from "@/lib/validation";

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
  return { id, sample };
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

// Edit the details: { caption } for samples; { caption, credit, sourceUrl } for references.
export async function PATCH(req: Request, ctx: Ctx) {
  const g = await guard(req, ctx);
  if ("error" in g) return g.error;
  const body = await readJson(req);
  if (typeof body?.caption !== "string") return Response.json({ error: "Send { caption: string }." }, { status: 400 });
  const { sample } = g;
  const details = validateGalleryImage({
    caption: body.caption,
    kind: sample.kind,
    credit: body.credit ?? sample.credit,
    sourceUrl: body.sourceUrl ?? sample.sourceUrl,
  });
  if (!details.ok) return Response.json({ errors: details.errors }, { status: 422 });
  setProjectImageCaption(getDb(), g.id, details.data.caption);
  if (sample.kind === "reference") setProjectImageCredit(getDb(), g.id, details.data.credit, details.data.sourceUrl);
  refresh();
  return Response.json({ ok: true });
}
