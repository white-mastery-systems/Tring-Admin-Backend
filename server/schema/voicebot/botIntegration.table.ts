import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { voiceBotSchema } from "..";
import { organizationSchema } from "../admin/organization.table";
import { integrationSchema } from "../admin/integration.table";

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

// Types
export type SelectVoicebotIntegration = InferSelectModel<
  typeof voicebotIntegrationSchema
>;
export type InsertVoicebotIntegration = InferInsertModel<
  typeof voicebotIntegrationSchema
>;