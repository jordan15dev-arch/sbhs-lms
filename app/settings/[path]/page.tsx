import { viewPaths } from "@better-auth-ui/core";
import { ensureSessionServer } from "@better-auth-ui/core/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import { Settings } from "@/components/auth/settings/settings";
import { auth } from "@/lib/auth";
import { organizationPlugin } from "@/lib/auth/organization-plugin";
import { getQueryClient } from "@/lib/query-client";

// This route reads request headers to resolve the session, so it renders
// per-request — opt it out of instant-navigation validation. Root `Providers`
// also calls `useParams()`, which has no value during prerendering.
export const instant = false;

// Keep in sync with the plugins registered in `components/providers.tsx`.
const validSettingsPaths = new Set<string>([
  ...Object.values(viewPaths.settings),
  ...Object.values(organizationPlugin().viewPaths?.settings ?? {})
]);

export default async function SettingsPage({
  params
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  if (!validSettingsPaths.has(path)) {
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
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/settings/${path}`)}`
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
        <Settings path={path} />
      </div>
    </HydrationBoundary>
  );
}
