import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
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

export const timeline = adminSchema.table("timeline", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id),
  org_id: uuid("org_id")
    .notNull()
    .references(() => organizationSchema.id),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

// Validation
export const zodInsertOrganization = createInsertSchema(organizationSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
});
