"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PICKABLE_ROLES } from "@/lib/roles";

/**
 * One-time role choice for self-registered users.
 *
 * The update only matches rows whose `role` is still null, so it is
 * idempotent and can never promote an existing teacher/student to admin.
 */
export async function chooseRole(formData: FormData): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in?redirectTo=/onboarding/role");
  }

  const requested = formData.get("role");

  if (
    typeof requested !== "string" ||
    !(PICKABLE_ROLES as readonly string[]).includes(requested)
  ) {
    redirect("/onboarding/role");
  }

  await prisma.user.updateMany({
    where: { id: session.user.id, role: null },
    data: { role: requested }
  });

  redirect("/dashboard");
}
