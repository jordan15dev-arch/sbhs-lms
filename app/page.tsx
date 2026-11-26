import { ensureSessionServer } from "@better-auth-ui/core/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/lib/auth";
import { getQueryClient } from "@/lib/query-client";

// Reads the session cookie, so this route can't be prerendered into the
// static shell — let it block and render per request instead.
export const instant = false;

// Entry point: send visitors to the dashboard when signed in, otherwise to
// the sign-in screen (which carries them back to /dashboard after login).
export default async function Home() {
  // The session check reads the clock (token expiry), which is unstable
  // during prerendering — stop the static shell here.
  await connection();

  const queryClient = getQueryClient();

  const session = await ensureSessionServer(queryClient, auth, {
    headers: await headers()
  });

  redirect(session ? "/dashboard" : "/auth/sign-in");
}
