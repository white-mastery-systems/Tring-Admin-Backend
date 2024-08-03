import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { text, uuid, varchar } from "drizzle-orm/pg-core";

import { adminSchema } from ".";
import { authUserSchema } from "./auth";
import { createInsertSchema } from "drizzle-zod";

// Tables
export const organizationSchema = adminSchema.table("organization", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  description: text("description"),
});

// Relations
export const organizationRelations = relations(
  organizationSchema,
  ({ many }) => ({
    users: many(authUserSchema),
  }),
);

// Types
export type SelectOrganization = InferSelectModel<typeof organizationSchema>;
export type InsertOrganization = InferInsertModel<typeof organizationSchema>;

// Validation
export const zodInsertOrganization = createInsertSchema(organizationSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
});
