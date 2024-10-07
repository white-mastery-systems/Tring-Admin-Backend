import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, jsonb, timestamp, uuid, varchar, unique, index } from "drizzle-orm/pg-core";
import { voiceBotSchema } from ".";
import { integrationSchema, organizationSchema } from "./admin";
import {botUserSchema} from './bot'
export const voicebotSchema = voiceBotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  role: varchar("role"),
  domain: varchar("domain").array(),
  active: boolean("active").default(false),
  metaData: jsonb("metadata"),
  llmConfig: jsonb("llm_config").default({
    provider: "openAi",
    model: "gpt-4o-mini",
    tokens: "2048",
    temperature: 1.0,
    role: "Assist-booking",
  }),
  textToSpeechConfig: jsonb("text_to_speech_config").default({
    provider: "google",
    language: "en-IN",
    voiceType: "hi-IN-Neural2-A",
    volumeTypeGrainDb: 0.5,
    pitch: 1.0,
    effectsProfileId: ["telephony-class-application"],
    speakingRate: 0
  }),
  speechToTextConfig: jsonb("speech_to_text_config").default({
    provider: "deepgram",
    language: "en-in",
    model: "nova-2",
    phraseSets: [
        {
            "value": ""
        }
    ],
    keywords: [],
    amplificationFactor: "2",
    utteranceEndMs: "1000",
    endpointing: "550"
  }),
  talentConfig: jsonb("talent_config").default({}),
  intents: varchar("intents").array(), // Array of strings
  ivrConfig: jsonb("ivr_config"),
  identityManagement: jsonb("identity_management"),
  createdAt: timestamp("created_at").defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const voicebotIntegrationSchema = voiceBotSchema.table(
  "bot_integrations",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    botId: uuid("bot_id")
      .references(() => voicebotSchema.id)
      .notNull(),
    metadata: jsonb("metadata"),
    integrationId: uuid("integration_id").references(
      () => integrationSchema.id,
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    organizationId: uuid("organization_id")
      .references(() => organizationSchema.id)
      .notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
);

export const callLogSchema = voiceBotSchema.table("call_logs", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  callSid: varchar("call_sid").notNull(),
  exophone: varchar("exophone").notNull(),
  from: varchar("from").notNull(),
  date: varchar("date").notNull(),
  duration: varchar("duration").notNull(),
  direction: varchar("direction").notNull(),
  callerName: varchar("caller_name").notNull(),
  callTranscription: varchar("call_transcription").notNull(),
  inputCredits: varchar("input_credits").notNull(),
  outputCredits: varchar("output_credits").notNull(),
  botId: uuid("bot_id")
      .references(() => voicebotSchema.id)
      .notNull(),
  organizationId: uuid("organization_id")
      .references(() => organizationSchema.id)
      .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const voiceBotLeadSchema = voiceBotSchema.table("leads", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  crmLeadId: varchar("crm_lead_id", { length: 128 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  botId: uuid("bot_id")
    .references(() => voicebotSchema.id)
    .notNull(),
  botUserId: uuid("bot_user_id")
    .references(() => botUserSchema.id)
    .notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
  status: varchar("status").default("default").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    leadConstraint: unique("Voicebot_leads_unique_constraint").on(
      table.botId,
      table.botUserId,
      table.organizationId,
    ),
    leadsBotIdIndex: index("voicebot_leads_bot_id_index").on(table.botId),
  })
)


export type SelectVoiceBot = InferSelectModel<typeof voicebotSchema>;
export type InsertVoiceBot = InferInsertModel<typeof voicebotSchema>;

export type SelectVoicebotIntegration = InferSelectModel<
  typeof voicebotIntegrationSchema
>;
export type InsertVoicebotIntegration = InferInsertModel<
  typeof voicebotIntegrationSchema
>;

export type SelectCallLogSchema = InferSelectModel<typeof callLogSchema>;
export type InsertCallLogSchema = InferInsertModel<typeof callLogSchema>;

export type SelectVoiceBotLead = InferSelectModel<typeof voiceBotLeadSchema>;
export type InsertVoiceBotLead = InferInsertModel<typeof voiceBotLeadSchema>;