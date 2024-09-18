import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  jsonb,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { chatSchema } from "./chats.table";
import { createInsertSchema } from "drizzle-zod";

export const messageSchema = chatbotSchema.table("messages", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  role: varchar("role", {
    length: 16,
    enum: ["user", "assistant", "comment"],
  }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  chatId: uuid("chat_id")
    .references(() => chatSchema.id, {
      onDelete: "cascade",
    })
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// relations
export const messageRelations = relations(messageSchema, ({ one }) => ({
  chat: one(chatSchema, {
    fields: [messageSchema.chatId],
    references: [chatSchema.id],
  }),
}));

// Types
export type SelectMessage = InferSelectModel<typeof messageSchema>;
export type InsertMessage = InferInsertModel<typeof messageSchema>;

// validation
export const zodInsertMessage = createInsertSchema(messageSchema);