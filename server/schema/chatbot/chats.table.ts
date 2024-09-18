import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  jsonb,
  timestamp,
  uuid,
  varchar,
  boolean,
  integer,
  index
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { chatBotSchema } from "./bot.table";
import { botUserSchema } from "./botUser.table";
import { organizationSchema } from "../admin/organization.table";
import { createInsertSchema } from "drizzle-zod";
import { leadSchema } from "./leads.table";
import { messageSchema } from "./message.table";

export const chatSchema = chatbotSchema.table("chats", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  metadata: jsonb("metadata"),
  mode: varchar("mode").default("live"),
  channel: varchar("channel", { length: 64 }).notNull().default("website"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  interacted: boolean("interacted").default(false),
  visitedCount: integer("visited_count").default(1),
  botUserId: uuid("bot_user_id").references(() => botUserSchema.id, {
    onDelete: "cascade",
  }),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id, { onDelete: "cascade" })
    .notNull(),
  organizationId: uuid("organization_id").references(
    () => organizationSchema.id,
    { onDelete: "cascade" },
  ),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(table) => ({
  chatsBotIdIndex: index("chats_bot_id_index").on(table.botId)
}));

// relations
export const chatsRelations = relations(chatSchema, ({ one, many }) => ({
  botUser: one(botUserSchema, {
    fields: [chatSchema.botUserId],
    references: [botUserSchema.id],
  }),
  bot: one(chatBotSchema, {
    fields: [chatSchema.botId],
    references: [chatBotSchema.id],
  }),
  lead: one(leadSchema),
  messages: many(messageSchema),
}));

// Types
export type SelectChat = InferSelectModel<typeof chatSchema>;
export type InsertChat = InferInsertModel<typeof chatSchema>;

// validation
export const zodInsertChat = createInsertSchema(chatSchema);