// Dev helper: prints Better Auth's resolved database schema (tables + fields)
// so it can be translated into prisma/schema.prisma.
// Run: npx tsx scripts/print-auth-schema.ts
import "dotenv/config";
import { getSchema } from "better-auth/db";

import { auth } from "../lib/auth";

console.log(JSON.stringify(getSchema(auth.options), null, 2));
