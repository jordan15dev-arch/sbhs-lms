// @ts-check
import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";
import web, { orm } from "./service.mjs";

export default module("sbhs-lms", ({ provision }) => {
  const db = provision(postgres({ name: "db", contract: orm, config: "./prisma.config.ts" }));
  provision(web, { deps: { db } });
});
