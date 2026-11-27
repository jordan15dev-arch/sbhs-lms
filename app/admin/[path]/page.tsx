import { viewPaths } from "@better-auth-ui/core";
import { ensureSessionServer } from "@better-auth-ui/core/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import { Admin } from "@/components/auth/admin/admin";
import { auth } from "@/lib/auth";
import { getQueryClient } from "@/lib/query-client";
import { hasAnyRole } from "@/lib/roles";

// This route reads request headers to resolve the session, so it renders
// per-request — opt it out of instant-navigation validation. Root `Providers`
// also calls `useParams()`, which has no value during prerendering.
export const instant = false;

// Keep in sync with the plugins registered in `components/providers.tsx`.
const validAdminPaths = new Set<string>(Object.values(viewPaths.admin));

export default async function AdminPage({
  params
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  if (!validAdminPaths.has(path)) {
    notFound();
  }

  // The session check reads the clock (token expiry), which is unstable
  // during prerendering — stop the static shell here.
  await connection();

  const requestHeaders = await headers();
  const queryClient = getQueryClient();

  const session = await ensureSessionServer(queryClient, auth, {
    headers: requestHeaders
  });

  if (!session) {
    redirect(
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/admin/${path}`)}`
    );
  }

  // Platform-admin only: teachers and students get a 404, not a tease.
  if (!hasAnyRole(session.user.role, ["admin"])) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
        <Admin path={path} />
      </div>
    </HydrationBoundary>
  );
}
