import { apiKey } from "@better-auth/api-key";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin,
  magicLink,
  multiSession,
  organization,
  username,
} from "better-auth/plugins";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import { prisma } from "./prisma";

/**
 * Better Auth server instance.
 *
 * Every feature enabled here needs its matching client plugin in
 * `lib/auth-client.ts` and its UI plugin in `components/providers.tsx`.
 */
export const auth = betterAuth({
  // Explicit so OAuth redirect URLs never depend on auto-detection.
  baseURL: process.env.BETTER_AUTH_URL,
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
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  // Self-registered users start with no role; `app/onboarding/role` asks for
  // teacher/student. Only an admin (or scripts/set-role.ts) can grant "admin".
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // The admin plugin below stamps every new user with `defaultRole`.
          // Keep that only for users created through the admin API — clear it
          // for sign-ups so onboarding can ask for the role.
          if (ctx?.path === "/admin/create-user") {
            return;
          }
          return { data: { role: null } };
        },
      },
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
    admin({
      defaultRole: "student",
      adminRoles: ["admin"],
      roles: {
        teacher: userAc,
        student: userAc,
        admin: adminAc,
      },
    }),
  ],
});
