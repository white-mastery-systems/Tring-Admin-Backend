import { boolean, integer, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { adminSchema } from "..";

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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});