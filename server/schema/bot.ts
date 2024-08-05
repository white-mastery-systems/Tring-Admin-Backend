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

export const documentSchema = chatbotSchema.table("document", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  status: varchar("status", {
    enum: ["processing", "ready", "error"],
  })
    .default("processing")
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  botId: uuid("bot_id")
    .references(() => chatBotSchema.id, { onDelete: "cascade" })
    .notNull(),
});

// Relations
export const chatBotRelations = relations(chatBotSchema, ({ one, many }) => ({
  organization: one(organizationSchema, {
    fields: [chatBotSchema.organizationId],
    references: [organizationSchema.id],
  }),
  documents: many(documentSchema),
}));

export const documentRelations = relations(documentSchema, ({ one }) => ({
  bot: one(chatBotSchema, {
    fields: [documentSchema.botId],
    references: [chatBotSchema.id],
  }),
}));

// Types
export type SelectChatBot = InferSelectModel<typeof chatBotSchema>;
export type InsertChatBot = InferInsertModel<typeof chatBotSchema>;

export type SelectDocument = InferSelectModel<typeof documentSchema>;
export type InsertDocument = InferInsertModel<typeof documentSchema>;

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

export const zodInsertDocument = createInsertSchema(documentSchema);
