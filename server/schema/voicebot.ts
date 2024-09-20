import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, jsonb, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { voiceBotSchema } from ".";
import { integrationSchema, organizationSchema } from "./admin";

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

export type SelectVoiceBot = InferSelectModel<typeof voicebotSchema>;
export type InsertVoiceBot = InferInsertModel<typeof voicebotSchema>;

export type SelectVoicebotIntegration = InferSelectModel<
  typeof voicebotIntegrationSchema
>;
export type InsertVoicebotIntegration = InferInsertModel<
  typeof voicebotIntegrationSchema
>;
