import { addDays } from "date-fns";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  real,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { adminSchema } from ".";
import { authUserSchema } from "./auth";
import { botUserSchema, chatBotSchema, leadSchema } from "./bot";
const nextMonthAndDayDate = addDays(new Date(), 1);

// Tables
export const organizationSchema = adminSchema.table("organization", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull().default(""),
  description: text("description"),
  metadata: jsonb("metadata").default({}).notNull(),
  usedQuota: integer("used_quota").default(0).notNull(),
  maxQuota: integer("max_quota").default(50).notNull(),
  planCode: varchar("plan_code", { length: 64 }).notNull().default("chat_free"),
  voicePlanCode: varchar("voice_plan_code").notNull().default("voice_free"),
  logo: jsonb("logo").default({}),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const statusEnum = pgEnum("status", [
  "active",
  "incomplete",
  "incomplete_expired",
  "trialing",
  "unpaid",
  "cancelled",
]);
export const paymentTypeEnum = pgEnum("type", ["subscription", "addon"]);
export const paymentSchema = adminSchema.table("payment", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id),
  organizationId: uuid("org_id").references(() => organizationSchema.id),
  customerId: text("customer_id").notNull(),
  plan_code: varchar("plan_code", { length: 64 }),
  amount: real("amount").notNull().default(0),
  subscription_metadata: jsonb("subscription_metadata"),
  subscriptionId: text("subscription_id"),
  productId: text("product_id"),
  customer_metadata: jsonb("customer_metadata"),
  addonCode: varchar("addon_code"),
  type: paymentTypeEnum("type").default("subscription").notNull(),
  status: statusEnum("status").default("active").notNull(),
  expiry: timestamp("expiry").default(nextMonthAndDayDate).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orgSubscriptionSchema = adminSchema.table("org_subscription", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  botType: varchar("bot_type"),
  subscriptionId: text("subscription_id"),
  planCode: varchar("plan_code"),
  subscriptionCreatedDate: text("subscription_created_date"),
  expiryDate: text("expiry_date"),
  status: text("status").default("active"),
  walletSessions: integer("wallet_sessions").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


export const integrationSchema = adminSchema.table("integration", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id),
  org_id: uuid("org_id")
    .notNull()
    .references(() => organizationSchema.id),
  name: varchar("name", { length: 64 }).notNull(),
  crm: varchar("crm", { length: 64 }).notNull(),
  type: varchar("type").default("crm"),
  metadata: jsonb("metadata")
    .$type<{
      apiKey?: string;
      code?: string;
      scope?: string;
      location?: string;
      api_domain?: string;
      expires_in?: string;
      token_type?: string;
      access_token?: string;
      refresh_token?: string;
      accountsServer?: string;
      stage:String;
      pid?: string;
      pin?: string;
      wabaId?: string;
    }>()
    .default({})
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const timelineSchema = adminSchema.table("timeline", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => botUserSchema.id),
  orgId: uuid("org_id").references(() => organizationSchema.id),
  chatId: uuid("chat_id"),
  botId: uuid("bot_id").references(() => chatBotSchema.id,{ onDelete: "cascade"}),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  event: varchar("event", { length: 64 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const adminConfigurationSchema = adminSchema.table("admin_config", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  metaData: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const adminPricingSchema = adminSchema.table("admin_pricing", {
  id: serial("id").primaryKey(),
  planCode: varchar("plan_code", { length: 128 }).notNull(),
  price: integer("price"),
  type: varchar("type", { length: 128 }).notNull().default("chatbot"),
  sessions: integer("sessions"),
  isIndiaPricing: boolean("is_india_pricing").default(false).notNull(),
  duration: varchar("duration", { length: 128 }).notNull(),
  extraSessionCost: real("extra_session_cost"),
  extraSessinsLimit: integer("extra_sessions_limit"),
  botsAllowed: integer("bots_allowed").default(1).notNull(),
  extraBotLimit: integer("extra_bot_limit"),
  extraBotCost: real("extra_bot_cost"),
  leadGenEnabled: boolean("lead_gen_enabled").default(false).notNull(),
  crmConfigEnabled: boolean("crm_config_enabled").default(false).notNull(),
  widgetCustomization: varchar("widget_customization").notNull(),
  tringBranding: varchar("tring_branding").notNull(),
  addons: jsonb("addons").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const numberIntegrationSchema = adminSchema.table("number_integration", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  provider: varchar("provider"),
  exoPhone: varchar("exo_phone"),
  metadata: jsonb("metadata"),
  countryCode: varchar("country_code"),
  organizationId: uuid("org_id")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// buckets
export const contactListSchema = adminSchema.table("contact_list", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name"),
  type: varchar("type").default("chat"),
  isDefault: boolean("is_default").default(false),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactSchema = adminSchema.table("contacts", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  email: varchar("email"),
  countryCode: varchar("country_code"),
  phone: varchar("phone"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactListContactsSchema = adminSchema.table("contact_list_contacts", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  contactListId: uuid("contact_list_id")
    .notNull()
    .references(() => contactListSchema.id, { onDelete: 'cascade' }), // Foreign key to contact_list
  contactId: uuid("contact_id")
    .notNull()
    .references(() => contactSchema.id, { onDelete: 'cascade' }), // Foreign key to contacts
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  }
);

export const voicebotContactSchema = adminSchema.table("voicebot_contacts", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name"),
  countryCode: varchar("country_code"),
  phone: varchar("phone"),
  metadata: varchar("metadata"),
  verificationId: varchar("verification_id"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const campaignSchema = adminSchema.table("campaign", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  countryCode: varchar("country_code"),
  phoneNumber: varchar("phone_number"),
  campaignDate: timestamp("campaign_date"),
  campaignTime: timestamp("campaign_time"),
  type: varchar("type"),
  templateId: uuid("template_id").references(() => templateSchema.id),
  contactListId: uuid("contact_list_id").references(
    () => contactListSchema.id,
    { onDelete: "cascade" },
  ),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const playgroundDocumentSchema = adminSchema.table(
  "playground_document",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: varchar("status", {
      enum: ["processing", "ready", "error"],
    })
      .default("processing")
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
);

export const promptSchema = adminSchema.table("prompt", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  prompt: text("prompt"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const templateSchema = adminSchema.table("templates", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name"),
  metadata: jsonb("metadata").default({}),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  verificationStatus: varchar("verification_status", { length: 64 }).default(
    "pending",
  ),
  integrationId: uuid("integration_id").references(() => integrationSchema.id),
  whatsappTemplateId: varchar("whatsapp_template_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orgVisitorSchema =  adminSchema.table("org_visitors", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  visitorId: uuid("visitor_id").notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Relations
export const organizationRelations = relations(
  organizationSchema,
  ({ many }) => ({
    users: many(authUserSchema),
    bots: many(chatBotSchema),
    botUsers: many(botUserSchema),
    leads: many(leadSchema),
    bills: many(paymentSchema),
  }),
);

export const contactListAndContactsRelations = relations(
  contactListContactsSchema,
  ({ one }) => ({
    contacts: one(contactSchema, {
       fields: [contactListContactsSchema.contactId],
       references: [contactSchema.id],
    }),
    bucket: one(contactListSchema, {
       fields: [contactListContactsSchema.contactListId],
       references: [contactListSchema.id],
    }),
  }),
)

export const billingRelations = relations(paymentSchema, ({ one }) => ({
  organization: one(organizationSchema, {
    fields: [paymentSchema.organizationId],
    references: [organizationSchema.id],
  }),
  user: one(authUserSchema, {
    fields: [paymentSchema.userId],
    references: [authUserSchema.id],
  }),
}));

// Types
export type SelectOrganization = InferSelectModel<typeof organizationSchema>;
export type InsertOrganization = InferInsertModel<typeof organizationSchema>;

export type InsertIntegration = InferInsertModel<typeof integrationSchema>;
export type SelectIntegration = InferSelectModel<typeof integrationSchema>;
export type InsertTimeline = InferInsertModel<typeof timelineSchema>;

export type SelectNumberIntegration = InferSelectModel<
  typeof numberIntegrationSchema
>;
export type InsertNumberIntegration = InferInsertModel<
  typeof numberIntegrationSchema
>;

export type SelectContactList = InferSelectModel<typeof contactListSchema>;
export type InsertContactList = InferInsertModel<typeof contactListSchema>;

export type SelectContacts = InferSelectModel<typeof contactSchema>;
export type InsertContacts = InferInsertModel<typeof contactSchema>;

export type SelectVoicebotContacts = InferSelectModel<typeof voicebotContactSchema>;
export type InsertVoicebotContacts = InferInsertModel<typeof voicebotContactSchema>;

export type SelectCampaign = InferSelectModel<typeof campaignSchema>;
export type InsertCampaign = InferInsertModel<typeof campaignSchema>;

export type SelectPlaygroundDocument = InferSelectModel<
  typeof playgroundDocumentSchema
>;
export type InsertPlaygroundDocument = InferInsertModel<
  typeof playgroundDocumentSchema
>;

export type SelectTemplates = InferSelectModel<typeof templateSchema>;
export type InsertTemplates = InferInsertModel<typeof templateSchema>;

// Validation
export const zodInsertOrganization = createInsertSchema(organizationSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
});

export const zodInsertPlaygroundDocument = createInsertSchema(
  playgroundDocumentSchema,
);
