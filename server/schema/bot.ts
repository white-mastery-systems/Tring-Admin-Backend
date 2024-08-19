import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  jsonb,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { chatbotSchema } from ".";
import { organizationSchema } from "./admin";

// Tables
export const chatBotSchema = chatbotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  documentId: uuid("document_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata").default({ ui: {}, crm: {}, prompt: {} }),

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

export const botUserSchema = chatbotSchema.table(
  "bot_user",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: varchar("name", { length: 64 }).notNull(),
    email: varchar("email", { length: 128 }),
    mobile: varchar("mobile", { length: 16 }),
    metaData: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),

    organizationId: uuid("organization_id")
      .references(() => organizationSchema.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    emailUnique: unique("bot_user_email")
      .on(table.email, table.organizationId)
      .nullsNotDistinct(),
    mobileUnique: unique("bot_user_mobile")
      .on(table.mobile, table.organizationId)
      .nullsNotDistinct(),
  }),
);

export const chatSchema = chatbotSchema.table("chats", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  botUserId: uuid("bot_user_id").references(() => botUserSchema.id, {
    onDelete: "cascade",
  }),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id, { onDelete: "cascade" })
    .notNull(),
});

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
});

export const leadSchema = chatbotSchema.table("leads", {
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
});

export const botIntentSchema = chatbotSchema.table("intents", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  intent: varchar("intent", { length: 64 }).notNull(),
  link: varchar("link").notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
});

export const botIntegrationSchema = chatbotSchema.table("bot_integrations", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
});

// Relations
export const chatBotRelations = relations(chatBotSchema, ({ one, many }) => ({
  organization: one(organizationSchema, {
    fields: [chatBotSchema.organizationId],
    references: [organizationSchema.id],
  }),
  documents: many(documentSchema),
  chats: many(chatSchema),
  leads: many(leadSchema),
}));

export const documentRelations = relations(documentSchema, ({ one }) => ({
  bot: one(chatBotSchema, {
    fields: [documentSchema.botId],
    references: [chatBotSchema.id],
  }),
}));

export const botUserRelations = relations(botUserSchema, ({ one, many }) => ({
  organization: one(organizationSchema, {
    fields: [botUserSchema.organizationId],
    references: [organizationSchema.id],
  }),
  chats: many(chatSchema),
  leads: many(leadSchema),
}));

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

export const messageRelations = relations(messageSchema, ({ one }) => ({
  chat: one(chatSchema, {
    fields: [messageSchema.chatId],
    references: [chatSchema.id],
  }),
}));

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
export type SelectChatBot = Omit<
  InferSelectModel<typeof chatBotSchema>,
  "metadata"
> & { metadata: Record<string, any> };
export type InsertChatBot = InferInsertModel<typeof chatBotSchema>;

export type SelectDocument = InferSelectModel<typeof documentSchema>;
export type InsertDocument = InferInsertModel<typeof documentSchema>;

export type SelectBotUser = InferSelectModel<typeof botUserSchema>;
export type InsertBotUser = InferInsertModel<typeof botUserSchema>;

export type SelectChat = InferSelectModel<typeof chatSchema>;
export type InsertChat = InferInsertModel<typeof chatSchema>;

export type SelectMessage = InferSelectModel<typeof messageSchema>;
export type InsertMessage = InferInsertModel<typeof messageSchema>;

export type SelectLead = InferSelectModel<typeof leadSchema>;
export type InsertLead = InferInsertModel<typeof leadSchema>;

export type SelectIntent = InferSelectModel<typeof botIntentSchema>;
export type InsertIntent = InferInsertModel<typeof botIntentSchema>;

export type SelectBotIntegration = InferSelectModel<
  typeof botIntegrationSchema
>;
export type InsertBotIntegration = InferInsertModel<typeof botIntegrationSchema>;
export type zodInsertBotIntegration = InferInsertModel<
  typeof botIntegrationSchema
>;

// Validations
export const zodInsertChatBot = createInsertSchema(chatBotSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
});

// export const zodInsertChatBotIntent = createInsertSchema(botIntentSchema, {
//   intent: (schema) => schema.intent.min(2, "Intent too short"),
//   link: (schema) => schema.link.min(5, "Link too short"),
// });

export const zodUpdateChatBot = zodInsertChatBot
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
  })
  .partial();

export const zodInsertDocument = createInsertSchema(documentSchema);

export const zodInsertBotUser = createInsertSchema(botUserSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
}).refine((data) => data.email || data.mobile, {
  message: "Either email or mobile is required",
  path: ["email", "mobile"],
});

export const zodInsertChat = createInsertSchema(chatSchema);

export const zodInsertMessage = createInsertSchema(messageSchema);

export const zodInsertLead = createInsertSchema(leadSchema);
