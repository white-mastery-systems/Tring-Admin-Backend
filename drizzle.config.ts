import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/schema/*.ts",
  out: "./drizzle",
  schemaFilter: ["public", "admin", "chatbot"],
  dbCredentials: {
    url: process.env.NUXT_DB_URL!,
  },
});
