import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { chatBotSchema } from "./bot.table";
import { chatSchema } from "./chats.table";
import { botUserSchema } from "./botUser.table";
import { organizationSchema } from "../admin/organization.table";
import { createInsertSchema } from "drizzle-zod";

export const leadSchema = chatbotSchema.table(
  "leads",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    crmLeadId: varchar("crm_lead_id", { length: 128 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),

    botId: uuid("bot_id")
      .references(() => chatBotSchema.id)
      .notNull(),
    botUserId: uuid("bot_user_id")
      .references(() => botUserSchema.id)
      .notNull(),
    chatId: uuid("chat_id")
      .references(() => chatSchema.id)
      .notNull(),
    organizationId: uuid("organization_id")
      .references(() => organizationSchema.id)
      .notNull(),
    status: varchar("status").default("default").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    leadConstraint: unique("leads_unique_constraint").on(
      table.botId,
      table.botUserId,
      table.organizationId,
    ),
    leadsBotIdIndex: index("leads_bot_id_index").on(table.botId)
  }),
);

// relations
export const leadsRelations = relations(leadSchema, ({ one }) => ({
  bot: one(chatBotSchema, {
    fields: [leadSchema.botId],
    references: [chatBotSchema.id],
  }),
  botUser: one(botUserSchema, {
    fields: [leadSchema.botUserId],
    references: [botUserSchema.id],
  }),
  chat: one(chatSchema, {
    fields: [leadSchema.chatId],
    references: [chatSchema.id],
  }),
  organization: one(organizationSchema, {
    fields: [leadSchema.organizationId],
    references: [organizationSchema.id],
  }),
}));

// Types
export type SelectLead = InferSelectModel<typeof leadSchema>;
export type InsertLead = InferInsertModel<typeof leadSchema>;

// validation
export const zodInsertLead = createInsertSchema(leadSchema);