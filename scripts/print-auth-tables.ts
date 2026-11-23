// Dev helper: prints Better Auth's table keys, model names, and fields so
// prisma/schema.prisma can be written to match exactly what the adapter expects.
// Run: npx tsx scripts/print-auth-tables.ts
import "dotenv/config";
import { getAuthTables } from "better-auth/db";

import { auth } from "../lib/auth";

const tables = getAuthTables(auth.options);

console.log(
  JSON.stringify(
    Object.entries(tables).map(([key, table]) => ({
      key,
      modelName: table.modelName,
      fields: table.fields
    })),
    null,
    2
  )
);
