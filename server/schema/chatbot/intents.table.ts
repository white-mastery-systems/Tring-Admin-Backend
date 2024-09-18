import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  jsonb,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { chatBotSchema } from "./bot.table";
import { organizationSchema } from "../admin/organization.table";

export const botIntentSchema = chatbotSchema.table("intents", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id")
    .references(() => chatBotSchema.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  intent: varchar("intent", { length: 64 }).notNull(),
  uploads: jsonb("uploads").array(),
  link: varchar("link"),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Types
export type SelectIntent = InferSelectModel<typeof botIntentSchema>;
export type InsertIntent = InferInsertModel<typeof botIntentSchema>;