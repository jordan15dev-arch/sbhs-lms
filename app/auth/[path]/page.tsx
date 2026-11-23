import { viewPaths } from "@better-auth-ui/core";
import { notFound } from "next/navigation";

import { Auth } from "@/components/auth/auth";
import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin";
import { organizationPlugin } from "@/lib/auth/organization-plugin";

// Root `Providers` calls `useParams()`, which has no value while this dynamic
// segment prerenders — opt it out of instant-navigation validation.
export const instant = false;

// Keep in sync with the plugins registered in `components/providers.tsx`.
const validAuthPaths = new Set<string>([
  ...Object.values(viewPaths.auth),
  ...Object.values(magicLinkPlugin().viewPaths?.auth ?? {}),
  ...Object.values(organizationPlugin().viewPaths?.auth ?? {})
]);

export default async function AuthPage({
  params
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  if (!validAuthPaths.has(path)) {
    notFound();
  }

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} />
    </div>
  );
}
