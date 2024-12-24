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
import { integrationSchema, organizationSchema, numberIntegrationSchema, campaignSchema, contactListSchema, voicebotContactSchema } from "./admin";

export const voicebotSchema = voiceBotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  role: varchar("role"),
  domain: varchar("domain").array(),
  active: boolean("active").default(false),
  metaData: jsonb("metadata"),
  audioFiles: jsonb("audio_files"),
  llmConfig: jsonb("llm_config").default({
    temperature: 1,
    top_p: "0.95",
    top_k: "40",
    max_output_token: "8192",
    prompt: "",
  }),
  textToSpeechConfig: jsonb("text_to_speech_config").default({
    "provider": "google",
    "google": {
        "name": "en-IN-Neural2-A",
        "speaking_rate": 1,
        "pitch": 1,
        "volume_gain_db": 0.5
    },
    "elevenlabs": {
        "api_key": "",
        "stability": 0.5,
        "similarity_boost": 1,
        "style": 0.5,
        "use_speaker_boost": false,
        "voice": "",
        "model": ""
    },
    "deepgram": {
        "voice": "aura-asteria-en"
    },
    "tring": {
        "api_key": "",
        "speaker": "",
        "speed": 1,
        "silence_pad":  250
    }
  }),
  speechToTextConfig: jsonb("speech_to_text_config").default({     
    "provider": "deepgram",
    "google": {
        "adaptation": true,
        "phrase_sets": [],
        "model": "short",
        "recognizer": "",
        "amplification_factor": 2
    },
    "azure": {
        "phrase_list": [],
        "amplification_factor": 3,
    },
    "deepgram": {
        "model": "nova-2",
        "utterance_end_ms": "1000",
        "endpointing": 250,
        "keywords": [],
        "amplification_factor": 2,
    },
    "assemblyai" : {
        "word_boost": [],
        "end_utterance_silence_threshold": 300,
        "amplification_factor": 2
    }
  }),
  botDetails: jsonb("bot_details"),
  preRecordedAudios: jsonb("pre_recorded_audios"),
  tools: jsonb("tools").default({
    "clientTools": [],
    "defaultTools": [
        "currentDate",
        "concludeCall"
    ]
  }),
  clientConfig: jsonb("client_config").default({
    llmCaching: false,
    dynamicCaching: false,
    distance: 0,
  }),
  intent: varchar("intent"),
  ivrConfig: uuid("ivr_config")
    .references(() => numberIntegrationSchema.id, { onDelete: "cascade" }),
  incomingPhoneNumber: varchar("incoming_phone_number"),
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
      .references(() => voicebotSchema.id, { onDelete: "cascade"}),
    metadata: jsonb("metadata"),
    integrationId: uuid("integration_id").references(
      () => integrationSchema.id,{
      onDelete: "cascade",
     }
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
    .references(() => voicebotSchema.id, { onDelete: "cascade" })
    .notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const voicebotLeadSchema = voiceBotSchema.table("leads",{
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name"),
  location: varchar("location"),
  phone: varchar("phone"),
  notes: varchar("notes"),
  scheduledDate: timestamp("scheduled_date"),
  metadata: jsonb("metadata"),
  botId: uuid("bot_id")
  .references(() => voicebotSchema.id, { onDelete: "cascade" })
  .notNull(),
  organizationId: uuid("organization_id")
  .references(() => organizationSchema.id, { onDelete: "cascade" })
  .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const outboundCallSchema = voiceBotSchema.table("outbound_calls", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => voicebotSchema.id, { onDelete: "cascade" }).notNull(),
  organizationId: uuid("organization_id").references(() => organizationSchema.id,  { onDelete: "cascade" }).notNull(),
  name: varchar("name"),
  phone: varchar("phone"),
  metadata: varchar("metadata"),
  verificationId: varchar("verification_id"),
  dialStatus: varchar("dial_status").default("not dialed"),
  callSid: varchar("call_sid"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const voicebotSchedularSchema = voiceBotSchema.table("voicebot_schedular", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => voicebotSchema.id, { onDelete: "cascade" }).notNull(),
  campaignId: uuid("campaign_id").references(() => campaignSchema.id, { onDelete: "cascade" }).notNull(),
  bucketId: uuid("bucket_id").references(() => contactListSchema.id, { onDelete: "cascade" }).notNull(),
  contactId: uuid("contact_id").references(() => voicebotContactSchema.id, { onDelete: "cascade" }).notNull(),
  organizationId: uuid("organization_id").references(() => organizationSchema.id, { onDelete: "cascade" }).notNull(),
  callSid: varchar("call_sid"),
  callStatus: varchar("call_status").default("not dialed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

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

export const voicebotIntegrationRelations = relations(
  voicebotIntegrationSchema,
  ({ one, many }) => ({
    integration: one(integrationSchema, {
      fields: [voicebotIntegrationSchema.integrationId],
      references: [integrationSchema.id],
    }),
  }),
);

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

export type SelectVoicebotSchedular = InferSelectModel<typeof voicebotSchedularSchema>;
export type InsertVoicebotSchedular = InferInsertModel<typeof voicebotSchedularSchema>;

export type SelectVoiceBotLead = InferSelectModel<typeof voicebotLeadSchema>;
export type InsertVoiceBotLead = InferInsertModel<typeof voicebotLeadSchema>;
