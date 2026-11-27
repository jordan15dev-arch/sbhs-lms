import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import { createAuthClient } from "better-auth/react";

/**
 * Better Auth React client.
 *
 * The plugin list must stay in sync with `lib/auth.ts` (server) and the UI
 * plugins passed to `AuthProvider` in `components/providers.tsx`.
 */
export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    magicLinkClient(),
    passkeyClient(),
    apiKeyClient(),
    multiSessionClient(),
    organizationClient(),
    // Roles must match `admin()` in `lib/auth.ts` so session user.role types
    // infer as "teacher" | "student" | "admin" on the client too.
    adminClient({
      roles: {
        teacher: userAc,
        student: userAc,
        admin: adminAc,
      },
    }),
  ],
});
