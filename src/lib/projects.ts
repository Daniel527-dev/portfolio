import path from "node:path";
import { addProject, addProjectImage, dataDir, deleteProject, deleteProjectImage, getDb } from "./db";
import { SEED_IMAGE_PREFIX } from "./seed-projects";
import { deleteImage, saveImage } from "./storage";
import type { GalleryImageInput, ProjectInput } from "./validation";

// Keeps a project's database rows and its image files in step.

export function uploadsDir() {
  return process.env.UPLOADS_DIR ?? path.join(dataDir(), "uploads");
}

/** Starting images ship in public/projects; uploaded images are served by the API. */
export function projectImageUrl(image: string) {
  if (image.startsWith(SEED_IMAGE_PREFIX)) return `/projects/${image}`;
  return `/api/projects/images/${image}`;
}

/** Stores the image, then the row; removes the image again if the insert fails. */
export function createProject(input: ProjectInput, imageBytes: Uint8Array) {
  const image = saveImage(uploadsDir(), imageBytes);
  try {
    return addProject(getDb(), { ...input, image });
  } catch (error) {
    deleteImage(uploadsDir(), image);
    throw error;
  }
}

/** Adds a sample or reference image to a project's gallery, with the same cleanup on failure. */
export function createProjectImage(projectId: number, input: GalleryImageInput, imageBytes: Uint8Array) {
  const image = saveImage(uploadsDir(), imageBytes);
  try {
    return addProjectImage(getDb(), { projectId, image, ...input });
  } catch (error) {
    deleteImage(uploadsDir(), image);
    throw error;
  }
}

export function removeProject(id: number) {
  const project = deleteProject(getDb(), id);
  if (project) {
    deleteImage(uploadsDir(), project.image);
    for (const sample of project.samples) deleteImage(uploadsDir(), sample.image);
  }
  return project;
}

export function removeProjectImage(id: number) {
  const sample = deleteProjectImage(getDb(), id);
  if (sample) deleteImage(uploadsDir(), sample.image);
  return sample;
}
