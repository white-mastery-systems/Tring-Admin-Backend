import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { voiceBotSchema } from ".";
import { integrationSchema, organizationSchema, numberIntegrationSchema, campaignSchema, contactListSchema, voicebotContactSchema, industriesSchema, contactGroupSchema, contactProfileSchema, newCampaignSchema } from "./admin";
import { createInsertSchema } from "drizzle-zod";

export const voicebotSchema = voiceBotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  role: varchar("role"),
  domain: varchar("domain").array(),
  industryId: uuid("industry_id").references(() =>  industriesSchema.id),
  knowledgeSource: varchar("knowledge_source", { enum: ["website", "document", "text"]}),
  websiteLink: varchar("website_link"),
  websiteContent: text("website_content"),
  textContent: text("text_content"),
  documentId: uuid("document_id"),
  active: boolean("active").default(false),
  metaData: jsonb("metadata"),
  audioFiles: jsonb("audio_files"),
  llmConfig: jsonb("llm_config").default({
    temperature: 0.6,
    top_p: "0.95",
    top_k: "40",
    max_output_token: "250",
    prompt: "",
    inboundPromptText: "",
    outboundPromptText: "",
    inboundPrompt: {},
    outboundPrompt: {}
  }),
  textToSpeechConfig: jsonb("text_to_speech_config").default({
    "provider": "google",
    "integratedTtsProvider": "google",
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
        "speed": 1,
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
    },
    "cartesia": {
      "model": "",
      "speed": "fast",
      "voice": "",
      "api_key": "",
      "version": "2024-06-10"
    },
    "neuphonic": {
      "voice": "",
      "speed": 1.0,
      "api_key": ""
    },
    "rime": {
      "model": "",
      "voice" : "",
      "api_key": "",
      "speed_alpha": 1.0,
      "reduce_latency": false,
      "repetition_penalty": 1.5,
      "temperature": 0.5,
      "top_p": 0.5,
      "max_tokens": 1200
    },
    "smallestai": {
      "model": "",
      "voice": "",
      "api_key": "",
      "speed": 1.0,
      "consistency": 0.5,
      "similarity": 0.1,
      "enhancement": 1.0
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
    "deepgram": {
        "model": "nova-2",
        "utterance_end_ms": "1000",
        "endpointing": 250,
        "keywords": [],
        "amplification_factor": 2,
    }
  }),
  botDetails: jsonb("bot_details"),
  preRecordedAudios: jsonb("pre_recorded_audios"),
  tools: jsonb("tools").default({
    "clientTools": [],
    "defaultTools": [
        "currentDate",
        "concludeCall",
        "genderIdentification"
    ]
  }),
  clientConfig: jsonb("client_config").default({
    llmCaching: false,
    dynamicCaching: false,
    distance: 0,
  }),
  intent: varchar("intent"),
  emailRecipients: varchar("email_recipients").array(),
  ivrConfig: uuid("ivr_config")
    .references(() => numberIntegrationSchema.id),
  incomingPhoneNumber: varchar("incoming_phone_number"),
  identityManagement: jsonb("identity_management"),
  createdAt: timestamp("created_at").defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
  isDeleted: boolean("is_deleted").default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const voicebotIntegrationSchema = voiceBotSchema.table(
  "bot_integrations",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    botId: uuid("bot_id")
      .references(() => voicebotSchema.id),
    metadata: jsonb("metadata"),
    status: varchar("status", { enum: ["active", "inactive"]}).default("active"),
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
  callStatus: varchar("call_status"),
  duration: varchar("duration").notNull(),
  direction: varchar("direction").notNull(),
  metrics: jsonb("metrics"),
  callerName: varchar("caller_name").notNull(),
  callerDate: timestamp("caller_date"),
  callTranscription: jsonb("call_transcription").array(),
  inputCredits: varchar("input_credits").notNull(),
  outputCredits: varchar("output_credits").notNull(),
  summary: varchar("summary"),
  inadequateResponses: jsonb("inadequate_responses").array(),
  botId: uuid("bot_id")
    .references(() => voicebotSchema.id)
    .notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
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
  callSid: varchar("call_sid"),
  callOutcome: varchar("call_outcome",{
    enum: ["Not Dialed", "Engaged", "Booked", "Follow Up", "New Lead", "Not Interested", "No Response", "Failed", "Invalid Number"]
  }).default("Not Dialed"),
  metadata: jsonb("metadata"),
  botId: uuid("bot_id")
  .references(() => voicebotSchema.id)
  .notNull(),
  callLogId: uuid("call_log_id").references(() => callLogSchema.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
  .references(() => organizationSchema.id)
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
  maxRetryCount: integer("max_retry_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const voicebotCallScheduleSchema = voiceBotSchema.table("voicebot_call_schedule", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => voicebotSchema.id, { onDelete: "cascade" }).notNull(),
  campaignId: uuid("campaign_id").references(() => newCampaignSchema.id, { onDelete: "cascade" }).notNull(),
  contactGroupId: uuid("contact_group_id").references(() => contactGroupSchema.id, { onDelete: "cascade" }).notNull(),
  contactId: uuid("contact_id").references(() => contactProfileSchema.id, { onDelete: "cascade" }).notNull(),
  organizationId: uuid("organization_id").references(() => organizationSchema.id, { onDelete: "cascade" }).notNull(),
  callSid: varchar("call_sid"),
  callStatus: varchar("call_status", {
    enum: ["Ongoing", "Not Dialed", "Engaged", "Booked", "Follow Up", "New Lead", "Not Interested", "No Response", "Failed", "Invalid Number"]
  }).default("Not Dialed"),
  retryAttemptTimestamps: jsonb("retry_attempt_timestamps").array(),
  isRetryExpired: boolean("is_retry_expired").default(false),
  maxRetryCount: integer("max_retry_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const salesHandyContactsSchema = voiceBotSchema.table("sales_handy_contacts", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => voicebotSchema.id, { onDelete: "cascade" }).notNull(),
  botIntegrationId: uuid("bot_integration_id").references(() => voicebotIntegrationSchema.id, { onDelete: "cascade" }).notNull(),
  sequenceId: varchar("sequence_id").notNull(),
  phone: varchar("phone").notNull(),
  countryCode: varchar("country_code"),
  email: varchar("email"),
  callSid: varchar("call_sid"),
  callStatus: varchar("call_status").default("not dialed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const voicebotDocumentSchema = voiceBotSchema.table("voicebot_documents", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizationSchema.id, { onDelete: "cascade" }).notNull(),
  voicebotId: uuid("voicebot_id").references(() => voicebotSchema.id, { onDelete: "cascade" }),
  documentName: varchar("document_name").notNull(),
  documentContent: text("document_content"),
  status: varchar("status", {
    enum: ["processing", "success", "failed"],
  }).default("processing"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const voiceResponseImprovementSchema = voiceBotSchema.table("voice_response_improvement", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizationSchema.id, { onDelete: "cascade" }).notNull(),
  botId: uuid("bot_id").references(() => voicebotSchema.id, { onDelete: "cascade" }).notNull(),
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

export const zodInsertVoiceBotDocument = createInsertSchema(voicebotDocumentSchema);

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

export const voicebotLeadRelations = relations(voicebotLeadSchema, ({ one }) => ({
  bot: one(voicebotSchema, {
    fields: [voicebotLeadSchema.botId],
    references: [voicebotSchema.id],
  }),
  callLog: one(callLogSchema, {
    fields: [voicebotLeadSchema.callLogId],
    references: [callLogSchema.id],
  }),
}))

export const voicebotScheduledCallsRelations = relations(voicebotSchedularSchema, ({ one }) => ({
  bucket: one(contactListSchema, {
    fields: [voicebotSchedularSchema.bucketId],
    references: [contactListSchema.id],
  }),
  contact: one(voicebotContactSchema, {
    fields: [voicebotSchedularSchema.contactId],
    references: [voicebotContactSchema.id],
  }),
  bot: one(voicebotSchema, {
    fields: [voicebotSchedularSchema.botId],
    references: [voicebotSchema.id],
  })
}))


export const voicebotCallRelations = relations(voicebotCallScheduleSchema, ({ one }) => ({
  contactGroup: one(contactGroupSchema, {
    fields: [voicebotCallScheduleSchema.contactGroupId],
    references: [contactGroupSchema.id],
  }),
  contact: one(contactProfileSchema, {
    fields: [voicebotCallScheduleSchema.contactId],
    references: [contactProfileSchema.id],
  }),
  bot: one(voicebotSchema, {
    fields: [voicebotCallScheduleSchema.botId],
    references: [voicebotSchema.id],
  }),
  campaign: one(newCampaignSchema, {
    fields: [voicebotCallScheduleSchema.campaignId],
    references: [newCampaignSchema.id],
  })
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

export type SelectVoicebotDocument = InferSelectModel<typeof voicebotDocumentSchema>;
export type InsertVoicebotDocument = InferInsertModel<typeof voicebotDocumentSchema>;

export type SelectVoicebotSchedular = InferSelectModel<typeof voicebotSchedularSchema>;
export type InsertVoicebotSchedular = InferInsertModel<typeof voicebotSchedularSchema>;

export type SelectVoicebotCallSchedule = InferSelectModel<typeof voicebotCallScheduleSchema>;
export type InsertVoicebotCallSchedule = InferInsertModel<typeof voicebotCallScheduleSchema>;

export type SelectVoiceBotLead = InferSelectModel<typeof voicebotLeadSchema>;
export type InsertVoiceBotLead = InferInsertModel<typeof voicebotLeadSchema>;

export type SelectVoiceResponseImprovement = InferSelectModel<typeof voiceResponseImprovementSchema>;
export type InsertVoiceResponseImprovement = InferInsertModel<typeof voiceResponseImprovementSchema>;