import { voicebot } from ".";
import { uuid, varchar, boolean, jsonb, text } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { organizationSchema } from "./admin"

export const voicebotSchema = voicebot.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  active: boolean("active").default(true),
  metaData: jsonb("metadata"),
  llmConfig: jsonb("llm_config"),
  defaultIntents: varchar("default_intents").array(), // Array of strings
  ivrConfig: jsonb("ivr_config"),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
})

// relations
export const voiceBotRelations = relations(voicebotSchema, ({one}) => ({
   organization: one(organizationSchema, {
    fields: [voicebotSchema.organizationId],
    references: [organizationSchema.id],
  }),
}))


export type SelectVoiceBot = InferSelectModel<typeof voicebotSchema>;
export type InsertVoiceBot = InferInsertModel<typeof voicebotSchema>;