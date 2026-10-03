import { revalidatePath } from "next/cache";
import { isOwner } from "@/lib/auth";
import { getDb, listProjects } from "@/lib/db";
import { createProject, projectImageUrl } from "@/lib/projects";
import { isSameOrigin } from "@/lib/request";
import { ImageError, MAX_IMAGE_BYTES } from "@/lib/storage";
import { validateProject } from "@/lib/validation";

// Public list of the project history.
export async function GET() {
  const projects = listProjects(getDb()).map((p) => ({ ...p, imageUrl: projectImageUrl(p.image) }));
  return Response.json({ projects });
}

// Owner-only upload: multipart form with title, summary, year, tags, featured and image.
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  if (!(await isOwner())) return Response.json({ error: "Sign in with Google to upload." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Send the project as multipart/form-data." }, { status: 400 });
  }

  const fields = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const result = validateProject(fields);
  const image = form.get("image");
  const errors = result.ok ? {} : { ...result.errors };
  if (!(image instanceof File) || image.size === 0) errors.image = "Choose an image of the work.";
  else if (image.size > MAX_IMAGE_BYTES) errors.image = "Images must be 8 MB or smaller.";
  if (!result.ok || Object.keys(errors).length > 0) return Response.json({ errors }, { status: 422 });

  try {
    const bytes = new Uint8Array(await (image as File).arrayBuffer());
    const id = createProject(result.data, bytes);
    revalidatePath("/projects");
    revalidatePath("/");
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    if (error instanceof ImageError) return Response.json({ errors: { image: error.message } }, { status: 422 });
    throw error;
  }
}
