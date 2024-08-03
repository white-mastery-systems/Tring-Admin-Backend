import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/schema/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.NUXT_DB_URL!,
  },
});
