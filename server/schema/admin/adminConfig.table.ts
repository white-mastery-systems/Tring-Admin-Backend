import { jsonb, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { adminSchema } from "..";

export const adminConfigurationSchema = adminSchema.table("admin_config", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  metaData: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});