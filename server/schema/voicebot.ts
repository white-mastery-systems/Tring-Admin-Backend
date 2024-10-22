import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { voiceBotSchema } from ".";
import { integrationSchema, organizationSchema, numberIntegrationSchema } from "./admin";

export const voicebotSchema = voiceBotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  role: varchar("role"),
  domain: varchar("domain").array(),
  active: boolean("active").default(false),
  metaData: jsonb("metadata"),
  audioFiles: jsonb("audio_files"),
  llmConfig: jsonb("llm_config").default({
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0,
    configuration: 0,
    top_p: "0.95",
    top_k: "64",
    max_output_token: "4096",
    prompt: "",
  }),
  textToSpeechConfig: jsonb("text_to_speech_config").default({
    "provider": "google",
    "google": {
        "name": "en-IN-Neural2-A",
        "speaking_rate": 1,
        "pitch": 1,
        "volume_gain_db": 0.5,
        "effects_profile_id": [
            "telephony-class-application"
        ]
    },
    "elevenlabs": {
        "api_key": "sk_3b0e5afba913980ebc8c96ee6150678ba99517b62501c576",
        "voice": "jBYIjE7vMSfVJhyXWNqw",
        "model": "eleven_turbo_v2",
        "stability": 0.5,
        "similarity_boost": 1,
        "style": 0.5,
        "use_speaker_boost": false
    },
    "deepgram": {
        "voice": "aura-asteria-en"
    }
  }),
  speechToTextConfig: jsonb("speech_to_text_config").default({
    "provider": "deepgram",
    "google": {
        "adaptation": true,
        "phrase_sets": [
        ],
        "encoding": "MULAW",
        "sample_rate_hertz": 8000,
        "audio_channel_count": 1,
        "model": "short",
        "intermediate_pause": 1,
        "response_timeout": 1,
        "recognizer": "projects/tringai-project1/locations/global/recognizers/english-in-short",
        "amplification_factor": 3,
        "noise_gate": 0
    },
    "azure": {
        "phrase_list": [],
        "encoding": "MULAW",
        "sample_rate_hertz": 8000,
        "audio_channel_count": 1,
        "amplification_factor": 3,
        "noise_gate": 0
    },
    "deepgram": {
        "version": "1",
        "encoding": "MULAW",
        "live_options": {
            "model": "nova-2",
            "smart_format": true,
            "channels": 1,
            "sample_rate": 8000,
            "interim_results": true,
            "utterance_end_ms": "1000",
            "vad_events": true,
            "endpointing": 50,
            "no_delay": true,
            "punctuate": true,
            "diarize": false,
            "filler_words": false,
            "numerals": true,
            "profanity_filter": true,
            "keywords": [
            ]
        },
        "addons": {
            "measurements": "true",
            "dictation": "true"
        },
        "amplification_factor": 2,
        "noise_gate": 0
    },
    "language": "en-IN"
  }),
  clientConfig: jsonb("client_config").default({
    agent_name: "Jenna",
    llm_caching: false,
    dynamic_caching: false,
    distance_threshold: 0.1,
    tools: [],
    default_tools: ["currentDate", "concludeCall"],
  }),
  // talentConfig: jsonb("talent_config").default({}),
  // intents: varchar("intents").array(), // Array of strings
  ivrConfig: uuid("ivr_config")
    .references(() => numberIntegrationSchema.id, { onDelete: "cascade" }),
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

export const voiceBotUserSchema = voiceBotSchema.table("bot_user", {
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
});

export const callLogSchema = voiceBotSchema.table("call_logs", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  callSid: varchar("call_sid").notNull(),
  exophone: varchar("exophone").notNull(),
  from: varchar("from").notNull(),
  date: varchar("date").notNull(),
  duration: varchar("duration").notNull(),
  direction: varchar("direction").notNull(),
  callerName: varchar("caller_name").notNull(),
  callTranscription: jsonb("call_transcription").array(),
  inputCredits: varchar("input_credits").notNull(),
  outputCredits: varchar("output_credits").notNull(),
  summary: varchar("summary"),
  botId: uuid("bot_id")
    .references(() => voicebotSchema.id)
    .notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const voiceBotLeadSchema = voiceBotSchema.table(
  "leads",
  {
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
  }),
);

// Relations
export const callLogsRelations = relations(callLogSchema, ({one}) => ({
   bot: one(voicebotSchema, {
      fields: [callLogSchema.botId],
      references: [voicebotSchema.id],
    }),
}))

export const voicebotRelations =relations(voicebotSchema, ({one}) => ({
   ivrConfigDetail: one(numberIntegrationSchema, {
      fields: [voicebotSchema.ivrConfig],
      references: [numberIntegrationSchema.id],
    }),
}))

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
