import { revalidatePath } from "next/cache";
import { isOwner } from "@/lib/auth";
import { getDb, getProject } from "@/lib/db";
import { createProjectImage } from "@/lib/projects";
import { isSameOrigin } from "@/lib/request";
import { ImageError, MAX_IMAGE_BYTES } from "@/lib/storage";
import { validateGalleryImage } from "@/lib/validation";

// Owner-only: add an image to a project's gallery. Multipart: image, caption, kind
// ("sample" | "reference"), and for references credit + sourceUrl.
export async function POST(req: Request, ctx: RouteContext<"/api/projects/[id]/images">) {
  if (!isSameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  if (!(await isOwner())) return Response.json({ error: "Sign in with Google to upload." }, { status: 401 });
  const projectId = Number((await ctx.params).id);
  if (!Number.isInteger(projectId) || !getProject(getDb(), projectId))
    return Response.json({ error: "Project not found." }, { status: 404 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Send the image as multipart/form-data." }, { status: 400 });
  }

  const fields = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const details = validateGalleryImage(fields);
  const image = form.get("image");
  const errors: Record<string, string> = details.ok ? {} : { ...details.errors };
  if (!(image instanceof File) || image.size === 0) errors.image = "Choose an image.";
  else if (image.size > MAX_IMAGE_BYTES) errors.image = "Images must be 8 MB or smaller.";
  if (!details.ok || Object.keys(errors).length > 0) return Response.json({ errors }, { status: 422 });

  try {
    const bytes = new Uint8Array(await (image as File).arrayBuffer());
    const id = createProjectImage(projectId, details.data, bytes);
    revalidatePath("/projects");
    revalidatePath("/");
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    if (error instanceof ImageError) return Response.json({ errors: { image: error.message } }, { status: 422 });
    throw error;
  }
}
