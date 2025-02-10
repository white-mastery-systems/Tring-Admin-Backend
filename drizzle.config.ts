import { defineConfig } from "drizzle-kit";

const config = useRuntimeConfig()

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/schema/*.ts",
  out: "./drizzle",
  schemaFilter: ["public", "admin", "chatbot", "voicebot"],
  dbCredentials: {
    url: config.dbUrl
  },
});
