import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    migrations: "prisma/migrations",
  },
  earlyAccess: true,
  datasource: {
    url: `file:${path.join(__dirname, "prisma", "dev.db")}`,
  },
});
