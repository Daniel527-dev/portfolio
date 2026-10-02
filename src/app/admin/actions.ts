"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/auth";
import { deleteMessage, getDb } from "@/lib/db";
import { rateLimit } from "@/lib/request";

export async function login(formData: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (!rateLimit(`login:${ip}`, 5, 15 * 60_000)) redirect("/admin?error=locked");

  if (!checkPassword(String(formData.get("password") ?? ""))) redirect("/admin?error=invalid");
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

export async function removeMessage(formData: FormData) {
  // Server actions are public endpoints, so re-check the session here too.
  if (!(await isAdmin())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) deleteMessage(getDb(), id);
  revalidatePath("/admin");
}
