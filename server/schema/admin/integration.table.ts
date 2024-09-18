import { jsonb, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizationSchema } from "./organization.table";
import { authUserSchema } from "./user.table";
import { adminSchema } from "..";

export const integrationSchema = adminSchema.table("integration", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id),
  org_id: uuid("org_id")
    .notNull()
    .references(() => organizationSchema.id),
  name: varchar("name", { length: 64 }).notNull(),
  crm: varchar("crm", { length: 64 }).notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertIntegration = InferInsertModel<typeof integrationSchema>;
export type SelectIntegration = InferSelectModel<typeof integrationSchema>;