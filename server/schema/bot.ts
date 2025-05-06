import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { chatbotSchema } from ".";
import { integrationSchema, organizationSchema, industriesSchema } from "./admin";
import { voicebotSchema } from "./voicebot"

// Tables
export const chatBotSchema = chatbotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  documentId: uuid("document_id"),
  integrationId: uuid("integration_id").references(() => integrationSchema.id),
  industryId: uuid("industry_id").references(() =>  industriesSchema.id),
  type: varchar("type", { length: 64 }).default("real-estate"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata").default({
    ui: {
      color: "236 61% 54%",
      secondaryColor: "236, 61%, 74%",
      widgetPosition: "Right",
      fontFamily: "Kanit",
      generateLead: true,
      openDelay: 3000,
    },
    prompt: {
      errorMessage:
        "Uh-oh, Can you try reloading the page and try chatting with me? It seems like our system is facing an issue. Thank you for your understanding",
    },
  }),
  emailRecipients: varchar("email_recipients").array(),
  channels: jsonb("channels")
    .$type<{
      whatsapp?: string;
    }>()
    .default({}),
  formStructure: jsonb("form_structure").default({}),
  customForms: jsonb("custom_forms").default({}),
  tools: jsonb("tools").default({
    customTools : [],
    defaultTools: []
  }),
  customTools: jsonb("custom_tools").array(),
  defaultTools: jsonb("default_tools").array(),
  scheduleCallWithVoice: boolean("schedule_call_with_voice").default(false),
  voiceBotId: uuid("voice_bot_id").references(() => voicebotSchema.id),
  status: varchar("status").default("inactive"),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
  isDeleted: boolean("is_deleted").default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const botDynamicFormSchema = chatbotSchema.table("bot_dynamic_form", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id, { onDelete: "cascade" })
    .notNull(),
  formValues: jsonb("form_values").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const documentSchema = chatbotSchema.table("document", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: varchar("status", {
    enum: ["processing", "ready", "error"],
  })
    .default("processing")
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" }),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id, { onDelete: "cascade" }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const botUserBotTypeEnum = pgEnum("userType", ["chatbot", "whatsapp", "voicebot"]);

export const botUserSchema = chatbotSchema.table(
  "bot_user",
 {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: varchar("name", { length: 64 }).notNull(),
    email: varchar("email", { length: 128 }),
    mobile: varchar("mobile", { length: 16 }),
    countryCode: varchar("country_code"),
    isNameVerified: boolean("is_name_verified").default(false),
    leadGenerated: boolean("lead_generated").default(false),
    secondaryEmail: varchar("secondary_email", { length: 128 }).array(),
    secondaryMobile: varchar("secondary_mobile", { length: 16 }).array(),
    metaData: jsonb("metadata"),
    companyWebsite: varchar("company_website", { length: 128 }),
    visitedCount: integer("visited_count").default(1),
    userType: botUserBotTypeEnum("user_type").default("chatbot"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    whatsappEnrichStatus: varchar("whatsapp_enrich_status", {
      enum : ["new", "pending", "responded", "meeting_link_sent", "meeting_booked", "meeting_cancelled", "meeting_rescheduled", "completed"]
    }).default("pending"),
    organizationId: uuid("organization_id")
      .references(() => organizationSchema.id, { onDelete: "cascade" })
      .notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  // (table) => ({
  //   emailUnique: unique("bot_user_email")
  //     .on(table.email, table.organizationId)
  //     .nullsNotDistinct(),
  //   mobileUnique: unique("bot_user_mobile")
  //     .on(table.mobile, table.organizationId)
  //     .nullsNotDistinct(),
  // }),
);

export const chatSchema = chatbotSchema.table(
  "chats",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    metadata: jsonb("metadata"),
    mode: varchar("mode").default("live"),
    channel: varchar("channel", { length: 64 }).notNull().default("website"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    interacted: boolean("interacted").default(false),
    visitedCount: integer("visited_count").default(1),
    visitedHistory: jsonb("visited_history").array(),
    chatExpiredAt: timestamp("chat_expired_at"),
    chatSummary: jsonb("chat_summary").default({}),
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
    isProcessed: boolean("is_processed").default(false),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    chatsBotIdIndex: index("chats_bot_id_index").on(table.botId),
  }),
);

export const messageSchema = chatbotSchema.table("messages", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  role: varchar("role", {
    length: 16,
    enum: ["user", "assistant", "comment"],
  }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: boolean("status").default(true),
  interactionStatus: varchar("interaction_status", { enum: 
    ["Booked", "Engaged", "Failed", "Follow Up", "Invalid Number", "New Lead", "Not Interested", "No Response"]
  }).default("No Response"),
  chatId: uuid("chat_id")
    .references(() => chatSchema.id, {
      onDelete: "cascade",
    })
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leadSchema = chatbotSchema.table(
  "leads",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    crmLeadId: varchar("crm_lead_id", { length: 128 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    botId: uuid("bot_id")
      .references(() => chatBotSchema.id, { onDelete: "cascade" })
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
    leadsBotIdIndex: index("leads_bot_id_index").on(table.botId),
  }),
);

export const botIntentSchema = chatbotSchema.table("intents", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id, { onDelete: "cascade"})
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  type: varchar("type"),
  intent: varchar("intent", { length: 64 }).notNull(),
  description: text("description"),
  uploads: jsonb("uploads").array(),
  emailRecipients: varchar("email_recipients").array(),
  isEmailEnabled: boolean("is_email_enabled").default(false),
  metadata: jsonb("metadata"),
  isActive: boolean("is_active").default(true),
  link: varchar("link"),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const botIntegrationSchema = chatbotSchema.table("bot_integrations", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => chatBotSchema.id,{ onDelete: "cascade"}),
  metadata: jsonb("metadata"),
  integrationId: uuid("integration_id").references(() => integrationSchema.id, {
    onDelete: "cascade",
  }),
  status: varchar("status", { enum: ["active", "inactive"]}).default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const analyticsSchema = chatbotSchema.table("analytics", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  sessions: integer("sessions").default(0),
  uniqueSessions: integer("unique_sessions").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
  botId: uuid("bot_id").references(() => chatBotSchema.id, { onDelete: "cascade" }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatbotScheduledCallSchema = chatbotSchema.table("chatbot_scheduled_calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(()=> organizationSchema.id, { onDelete: "cascade" }),
  name: varchar("name"),
  email: varchar("email"),
  phone: varchar("phone"),
  countryCode: varchar("country_code"),
  scheduledDateTime: timestamp("scheduled_date_time"),
  callSid: varchar("call_sid"),
  callStatus: varchar("call_status").default("not dialed"),
  voicebotId: uuid("voicebot_id").references(() => voicebotSchema.id, { onDelete: "cascade" }),
  chatbotId: uuid("chatbot_id").references(() => chatBotSchema.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Whatsapp Enrichments
export const whatsappEnrichmentSchema = chatbotSchema.table("whatsapp_enrichment", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizationSchema.id, { onDelete: "cascade" }).notNull(),
  botUserId: uuid("bot_user_id").references(() => botUserSchema.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name"),
  email: varchar("email"),
  phone: varchar("phone").notNull(),
  countryCode: varchar("country_code").notNull(),
  company: varchar("company"),
  companyUrl: varchar("company_url"),
  metadata: jsonb("metadata").default({}),
  status: varchar("status", {
    enum: ["new", "responded", "meeting_link_sent", "meeting_booked", "meeting_cancelled", "meeting_rescheduled", "completed"],
  }).default("new").notNull(),
  integrationId: uuid("integration_id").references(() => integrationSchema.id, { onDelete: "cascade" }).notNull(),
  leadStatus: boolean("lead_status").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const chatResponseImprovementSchema = chatbotSchema.table("chat_response_improvement", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizationSchema.id, { onDelete: "cascade" }).notNull(),
  botId: uuid("bot_id").references(() => chatBotSchema.id, { onDelete: "cascade" }).notNull(),
  title: text("title"),
  instances: jsonb("instances").array(),
  suggestions: text("suggestions").array(),
  answer: text("answer"),
  status: varchar("status", {
    enum: ["trained", "not_trained"],
  }).default("not_trained").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Relations
export const chatBotRelations = relations(chatBotSchema, ({ one, many }) => ({
  organization: one(organizationSchema, {
    fields: [chatBotSchema.organizationId],
    references: [organizationSchema.id],
  }),
  industry: one(industriesSchema, {
    fields: [chatBotSchema.industryId],
    references: [industriesSchema.id],
  }),
  documents: many(documentSchema),
  chats: many(chatSchema),
  leads: many(leadSchema),
}));

export const chatBotIntegrationRelations = relations(
  botIntegrationSchema,
  ({ one, many }) => ({
    integration: one(integrationSchema, {
      fields: [botIntegrationSchema.integrationId],
      references: [integrationSchema.id],
    }),
  }),
);

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

export const analyticsRelations = relations(
  analyticsSchema,
  ({ one, many }) => ({
    organization: one(organizationSchema, {
      fields: [analyticsSchema.organizationId],
      references: [organizationSchema.id],
    }),
    bot: one(chatBotSchema, {
      fields: [analyticsSchema.botId],
      references: [chatBotSchema.id],
    }),
  }),
);

export const whatsappEnrichmentRelations = relations(whatsappEnrichmentSchema, ({one, many}) => ({
  integration: one(integrationSchema, { 
    fields: [whatsappEnrichmentSchema.integrationId],
    references: [integrationSchema.id]
  }),
  botUser: one(botUserSchema, {
    fields: [whatsappEnrichmentSchema.botUserId],
    references: [botUserSchema.id]
  })
}))

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

export type SelectChatbotScheduledCall = InferSelectModel<typeof chatbotScheduledCallSchema>;
export type InsertChatbotScheduledCall = InferInsertModel<typeof chatbotScheduledCallSchema>;

export type SelectBotIntegration = InferSelectModel<
  typeof botIntegrationSchema
>;
export type InsertBotIntegration = InferInsertModel<
  typeof botIntegrationSchema
>;
export type zodInsertBotIntegration = InferInsertModel<
  typeof botIntegrationSchema
>;

// Validations
export const zodInsertChatBot = createInsertSchema(chatBotSchema)

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
  .partial().passthrough();

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
