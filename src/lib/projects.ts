import path from "node:path";
import { addProject, dataDir, deleteProject, getDb } from "./db";
import { deleteImage, saveImage } from "./storage";
import type { ProjectInput } from "./validation";

// Keeps a project's database row and its image file in step.

export function uploadsDir() {
  return process.env.UPLOADS_DIR ?? path.join(dataDir(), "uploads");
}

export function projectImageUrl(image: string) {
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

export function removeProject(id: number) {
  const project = deleteProject(getDb(), id);
  if (project) deleteImage(uploadsDir(), project.image);
  return project;
}
