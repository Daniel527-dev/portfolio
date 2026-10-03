import { uploadsDir } from "@/lib/projects";
import { mimeForStoredImage, readImage } from "@/lib/storage";

// Serves uploaded project images. File names are random UUIDs that never get
// reused, so responses can be cached forever.
export async function GET(_req: Request, ctx: RouteContext<"/api/projects/images/[file]">) {
  const { file } = await ctx.params;
  const bytes = readImage(uploadsDir(), file);
  if (!bytes) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": mimeForStoredImage(file),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
