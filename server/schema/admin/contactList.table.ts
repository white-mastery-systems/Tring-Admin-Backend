import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizationSchema } from "./organization.table";
import { adminSchema } from "..";

export const contactListSchema = adminSchema.table("contact_list", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name"),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectContactList = InferSelectModel<typeof contactListSchema>;
export type InsertContactList = InferInsertModel<typeof contactListSchema>;