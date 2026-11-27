import { ensureSessionServer } from "@better-auth-ui/core/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { GraduationCapIcon, SchoolIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getQueryClient } from "@/lib/query-client";

import { chooseRole } from "./actions";

// Reads the session cookie, so this route can't be prerendered into the
// static shell — let it block and render per request instead.
export const instant = false;

export default async function OnboardingRolePage() {
  // The session check reads the clock (token expiry), which is unstable
  // during prerendering — stop the static shell here.
  await connection();

  const queryClient = getQueryClient();

  const session = await ensureSessionServer(queryClient, auth, {
    headers: await headers()
  });

  if (!session) {
    redirect("/auth/sign-in?redirectTo=/onboarding/role");
  }

  // Already picked a role (or is an admin) — nothing to do here.
  if (session.user.role) {
    redirect("/dashboard");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 my-auto p-4 md:p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">How will you use the LMS?</h1>
          <p className="text-muted-foreground">
            Pick the role that fits you. You can&apos;t change this yourself
            later — ask an administrator if you pick wrong.
          </p>
        </div>

        <form action={chooseRole} className="grid w-full gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <GraduationCapIcon className="size-6 text-muted-foreground" />
              <CardTitle>I&apos;m a Teacher</CardTitle>
              <CardDescription>
                Create and manage courses, and track your students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                name="role"
                type="submit"
                value="teacher"
              >
                Continue as teacher
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SchoolIcon className="size-6 text-muted-foreground" />
              <CardTitle>I&apos;m a Student</CardTitle>
              <CardDescription>
                Enroll in courses and follow your learning progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                name="role"
                type="submit"
                value="student"
              >
                Continue as student
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </HydrationBoundary>
  );
}
