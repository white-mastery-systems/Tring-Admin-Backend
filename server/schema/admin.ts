import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { boolean, jsonb, text, uuid, varchar } from "drizzle-orm/pg-core";

import { adminSchema } from ".";
import { authUserSchema } from "./auth";
import { chatBotSchema, botUserSchema, leadSchema } from "./bot";
import { createInsertSchema } from "drizzle-zod";

// Tables
export const organizationSchema = adminSchema.table("organization", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull().default(""),
  description: text("description"),
  metadata: jsonb("metadata").default({}).notNull(),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
});

// Relations
export const organizationRelations = relations(
  organizationSchema,
  ({ many }) => ({
    users: many(authUserSchema),
    bots: many(chatBotSchema),
    botUsers: many(botUserSchema),
    leads: many(leadSchema),
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
