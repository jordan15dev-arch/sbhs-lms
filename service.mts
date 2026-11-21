// @ts-check
import nextjs from "@prisma/composer/nextjs";
import { compute } from "@prisma/composer-prisma-cloud";
import { dataContract, postgres } from "@prisma/composer-prisma-cloud/orm";
import type { Contract } from "./src/prisma/contract";
import contractJson from "./src/prisma/contract.json" with { type: "json" };

export const orm = dataContract<Contract>(contractJson);

export default compute({
  name: "web",
  deps: { db: postgres(orm) },
  build: nextjs({ module: import.meta.url, appDir: "." }),
});
