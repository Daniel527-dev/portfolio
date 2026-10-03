"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { endSession, isOwner } from "@/lib/auth";
import { deleteMessage, getDb } from "@/lib/db";

export async function logout() {
  await endSession();
  redirect("/admin");
}

export async function removeMessage(formData: FormData) {
  // Server actions are public endpoints, so re-check the session here too.
  if (!(await isOwner())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) deleteMessage(getDb(), id);
  revalidatePath("/admin");
}
