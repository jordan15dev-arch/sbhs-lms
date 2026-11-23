import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import {
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
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
  ],
});
