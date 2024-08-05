import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { jsonb, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { chatbotSchema } from ".";
import { organizationSchema } from "./admin";
import { createInsertSchema } from "drizzle-zod";

// Tables
export const chatBotSchema = chatbotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),

  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
});

// Relations
export const chatBotRelations = relations(chatBotSchema, ({ one }) => ({
  organization: one(organizationSchema, {
    fields: [chatBotSchema.organizationId],
    references: [organizationSchema.id],
  }),
}));

// Types
export type SelectChatBot = InferSelectModel<typeof chatBotSchema>;
export type InsertChatBot = InferInsertModel<typeof chatBotSchema>;

// Validations
export const zodInsertChatBot = createInsertSchema(chatBotSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
});
export const zodUpdateChatBot = zodInsertChatBot
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
  })
  .required();
