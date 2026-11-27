import { ensureSessionServer } from "@better-auth-ui/core/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  BookOpenIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getQueryClient } from "@/lib/query-client";
import { parseRoles } from "@/lib/roles";

// Reads the session cookie, so this route can't be prerendered into the
// static shell — let it block and render per request instead.
export const instant = false

export default async function Dashboard() {
  // The session check reads the clock (token expiry), which is unstable
  // during prerendering — stop the static shell here.
  await connection()

  const queryClient = getQueryClient()

  const session = await ensureSessionServer(queryClient, auth, {
    headers: await headers()
  })

  if (!session) {
    redirect("/auth/sign-in?redirectTo=/dashboard")
  }

  const roles = parseRoles(session.user.role)

  // Signed in but never picked a role — send them to the picker.
  if (roles.length === 0) {
    redirect("/onboarding/role")
  }

  const isTeacher = roles.includes("teacher")
  const isStudent = roles.includes("student")
  const isAdmin = roles.includes("admin")

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full max-w-4xl flex-col gap-6 my-auto p-4 md:p-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl">Hello, {session.user.email}</h1>
            {roles.map((role) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))}
          </div>

          <Link className="text-sm underline underline-offset-4" href="/auth/sign-out">
            Sign Out
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {isAdmin && (
            <Card>
              <CardHeader>
                <ShieldCheckIcon className="size-6 text-muted-foreground" />
                <CardTitle>Platform administration</CardTitle>
                <CardDescription>
                  Manage users, roles, and access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  className="text-sm underline underline-offset-4"
                  href="/admin/users"
                >
                  Open admin panel
                </Link>
              </CardContent>
            </Card>
          )}

          {isTeacher && (
            <Card>
              <CardHeader>
                <LayoutDashboardIcon className="size-6 text-muted-foreground" />
                <CardTitle>Manage courses</CardTitle>
                <CardDescription>
                  Create courses, add content, and review your students.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Course management is coming in the next iteration.
              </CardContent>
            </Card>
          )}

          {isStudent && (
            <Card>
              <CardHeader>
                <BookOpenIcon className="size-6 text-muted-foreground" />
                <CardTitle>My courses</CardTitle>
                <CardDescription>
                  Your enrolled courses and learning progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                You aren&apos;t enrolled in any courses yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HydrationBoundary>
  )
}
