"use server";

import { createSession, deleteSession } from "@/lib/session";
import { localStorageService } from "@/shared/services/localStorageService";
import { redirect } from "next/navigation";

export async function loginAction(userId: string) {
  await createSession(userId);
  //redirect('/dolibarr')
}

export async function logoutAction() {
  localStorageService.removeItem("user");
  localStorageService.removeItem("pass");
  localStorageService.removeItem("dolibarrToken");
  await deleteSession();
  redirect("/");
}
