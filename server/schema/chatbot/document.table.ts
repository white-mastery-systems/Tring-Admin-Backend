import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { chatBotSchema } from "./bot.table";
import { createInsertSchema } from "drizzle-zod";

export const documentSchema = chatbotSchema.table("document", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: varchar("status", {
    enum: ["processing", "ready", "error"],
  })
    .default("processing")
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  botId: uuid("bot_id")
    .references(() => chatBotSchema.id, { onDelete: "cascade" })
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// relations
export const documentRelations = relations(documentSchema, ({ one }) => ({
  bot: one(chatBotSchema, {
    fields: [documentSchema.botId],
    references: [chatBotSchema.id],
  }),
}));

// Types
export type SelectDocument = InferSelectModel<typeof documentSchema>;
export type InsertDocument = InferInsertModel<typeof documentSchema>;

// validations
export const zodInsertDocument = createInsertSchema(documentSchema);