// Promote (or demote) a user's role directly in the database — the only way
// to create the first admin, since /admin requires an admin to reach.
//
// Run: npx tsx scripts/set-role.ts you@example.com admin
// Roles: teacher | student | admin
import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  const [, , email, role] = process.argv;

  if (!email || !role || !["teacher", "student", "admin"].includes(role)) {
    console.error(
      "Usage: npx tsx scripts/set-role.ts <email> <teacher|student|admin>"
    );
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`No user with email "${email}"`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role }
  });

  console.log(
    `${updated.email}: role ${user.role ?? "(none)"} → ${updated.role}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
