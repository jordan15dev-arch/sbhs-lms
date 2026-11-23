import { apiKey } from "@better-auth/api-key";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  magicLink,
  multiSession,
  organization,
  username,
} from "better-auth/plugins";
import { prisma } from "./prisma";

/**
 * Better Auth server instance.
 *
 * Every feature enabled here needs its matching client plugin in
 * `lib/auth-client.ts` and its UI plugin in `components/providers.tsx`.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [
    username(),
    magicLink({
      // TODO: swap for a real email transport (Resend, SMTP, ...) before production.
      sendMagicLink: async ({ email, url }) => {
        console.log(`[auth] Magic link for ${email}: ${url}`);
      },
    }),
    passkey(),
    apiKey([
      { configId: "default", references: "user" },
      { configId: "organization", references: "organization" },
    ]),
    multiSession(),
    organization(),
  ],
});
