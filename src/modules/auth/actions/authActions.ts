"use server";

import { createSession, deleteSession } from "@/lib/session";

export async function loginAction(userId: string) {
  await createSession(userId);
}

export async function logoutAction() {
  await deleteSession();
}
