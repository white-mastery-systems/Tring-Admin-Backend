import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
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

// Tables
export const organizationSchema = adminSchema.table("organization", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull().default(""),
  description: text("description"),
  metadata: jsonb("metadata").default({}).notNull(),
  usedQuota: integer("used_quota").default(0).notNull(),
  maxQuota: integer("max_quota").default(50).notNull(),
  planCode: varchar("plan_code", { length: 64 }).notNull().default("FREE"),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
});

export const billingSchema = adminSchema.table("billing", {
  user_id: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id),
  org_id: uuid("org_id")
    .notNull()
    .references(() => organizationSchema.id),
  customer_id: text("customer_id").notNull(),
  plan_code: varchar("plan_code", { length: 64 }),
  subscription_metadata: jsonb("subscription_metadata"),
  customer_metadata: jsonb("customer_metadata"),
});

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
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const timelineSchema = adminSchema.table("timeline", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => botUserSchema.id),
  orgId: uuid("org_id").references(() => organizationSchema.id),
  chatId: uuid("chat_id"),
  botId: uuid("bot_id").references(() => chatBotSchema.id),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  intent: varchar("intent", { length: 64 }),
});
export const adminConfigurationSchema = adminSchema.table("admin_config", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  metaData: jsonb("metadata").default({}).notNull(),
});
export const adminPricingSchema = adminSchema.table("admin_pricing", {
  id: serial("id").primaryKey(),
  planCode: varchar("plan_code", { length: 128 }).notNull(),
  price: integer("price"),
  type: varchar("type", { length: 128 }).notNull().default("chatbot"),
  sessions: integer("sessions"),
  isIndiaPricing: boolean("is_india_pricing").default(false).notNull(),
  duration: varchar("duration", { length: 128 }).notNull(),
  extraSessionCost: integer("extra_session_cost"),
  extraSessinsLimit: integer("extra_sessions_limit"),
  botsAllowed: integer("bots_allowed").default(1).notNull(),
  extraBotLimit: integer("extra_bot_limit"),
  extraBotCost: integer("extra_bot_cost"),
  leadGenEnabled: boolean("lead_gen_enabled").default(false).notNull(),
  crmConfigEnabled: boolean("crm_config_enabled").default(false).notNull(),
  widgetCustomization: varchar("widget_customization").notNull(),
  tringBranding: varchar("tring_branding").notNull(),
});

// Relations
export const organizationRelations = relations(
  organizationSchema,
  ({ many }) => ({
    users: many(authUserSchema),
    bots: many(chatBotSchema),
    botUsers: many(botUserSchema),
    leads: many(leadSchema),
    bills: many(billingSchema),
  }),
);

export const billingRelations = relations(billingSchema, ({ one }) => ({
  organization: one(organizationSchema, {
    fields: [billingSchema.org_id],
    references: [organizationSchema.id],
  }),
  user: one(authUserSchema, {
    fields: [billingSchema.user_id],
    references: [authUserSchema.id],
  }),
}));

// Types
export type SelectOrganization = InferSelectModel<typeof organizationSchema>;
export type InsertOrganization = InferInsertModel<typeof organizationSchema>;

export type InsertIntegration = InferInsertModel<typeof integrationSchema>;
export type SelectIntegration = InferSelectModel<typeof integrationSchema>;
export type InsertTimeline = InferInsertModel<typeof timelineSchema>;

// Validation
export const zodInsertOrganization = createInsertSchema(organizationSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
});
