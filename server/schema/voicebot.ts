import { voiceBotSchema } from ".";
import { uuid, varchar, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { organizationSchema, integrationSchema } from "./admin";

export const voicebotSchema = voiceBotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  role: varchar("role"),
  domain: varchar("domain").array(),
  active: boolean("active").default(false),
  metaData: jsonb("metadata"),
  llmConfig: jsonb("llm_config"),
  intents: varchar("intents").array(), // Array of strings
  ivrConfig: jsonb("ivr_config"),
  createdAt: timestamp("created_at").defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
})

export const voicebotIntegrationSchema = voiceBotSchema.table("bot_integrations", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id")
    .references(() => voicebotSchema.id)
    .notNull(),
  metadata: jsonb("metadata"),
  integrationId: uuid("integration_id").references(() => integrationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
});



export type SelectVoiceBot = InferSelectModel<typeof voicebotSchema>;
export type InsertVoiceBot = InferInsertModel<typeof voicebotSchema>;

export type SelectVoicebotIntegration = InferSelectModel<typeof voicebotIntegrationSchema>;
export type InsertVoicebotIntegration = InferInsertModel<typeof voicebotIntegrationSchema>;