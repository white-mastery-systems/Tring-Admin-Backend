import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, jsonb, timestamp, uuid, varchar, unique, index } from "drizzle-orm/pg-core";
import { voiceBotSchema } from ".";
import { integrationSchema, organizationSchema } from "./admin";

export const voicebotSchema = voiceBotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  mobile: varchar("mobile"),
  countryCode: varchar("country_code"),
  role: varchar("role"),
  domain: varchar("domain").array(),
  active: boolean("active").default(false),
  metaData: jsonb("metadata"),
  llmConfig: jsonb("llm_config").default({
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0,
    role: "Assist-booking",
    configuration: 0,
    top_p: "0.95",
    top_k: "64",
    max_output_token: "4096",
    prompt: ""
  }),
  textToSpeechConfig: jsonb("text_to_speech_config").default({
    provider: "google",
    google: {
      name: "en-IN-Neural2-A",
      speaking_rate: 1,
      pitch: 1,
      volume_gain_db: 0.5,
      effects_profile_id: [
        "telephony-class-application"
      ]
    }
  }),
  speechToTextConfig: jsonb("speech_to_text_config").default({
    provider: "deepgram",
    deepgram: {
      version: "1",
      encoding: "MULAW",
      live_options: {
          model: "nova-2",
          smart_format: true,
          channels: 1,
          sample_rate: 8000,
          interim_results: true,
          utterance_end_ms: "1000",
          vad_events: true,
          endpointing: 550,
          no_delay: true,
          punctuate: true,
          diarize: false,
          filler_words: false,
          numerals: true,
          profanity_filter: true,
          keywords: []
      },
      addons: {
          measurements: "true",
          dictation: "true"
      },
      amplification_factor: 2,
      noise_gate: 0
    }
  }),
  client_config: jsonb("client_config").default({
    agent_name: "Jenna",
    llm_caching: false,
    dynamic_caching: false,
    distance_threshold: 0.1,
    tools: [],
    default_tools: [
        "currentDate",
        "concludeCall"
    ]
  }),
  // talentConfig: jsonb("talent_config").default({}),
  // intents: varchar("intents").array(), // Array of strings
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

export const voiceBotUserSchema = voiceBotSchema.table("bot_user",{
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  mobile: varchar("mobile").notNull(),
  metadata: jsonb("metadata"),
  botId: uuid("bot_id")
    .references(() => voicebotSchema.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

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
    .references(() => voiceBotUserSchema.id)
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