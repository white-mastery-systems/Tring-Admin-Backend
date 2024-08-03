import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const organizationSchema = pgTable("organization", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
