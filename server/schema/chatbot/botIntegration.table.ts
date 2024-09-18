import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  jsonb,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { chatBotSchema } from "./bot.table";
import { integrationSchema } from "../admin/integration.table";
import { organizationSchema } from "../admin/organization.table";

export const botIntegrationSchema = chatbotSchema.table("bot_integrations", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => chatBotSchema.id),
  metadata: jsonb("metadata"),
  integrationId: uuid("integration_id").references(() => integrationSchema.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id)
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// relation
export const chatBotIntegrationRelations = relations(
  botIntegrationSchema,
  ({ one, many }) => ({
    integration: one(integrationSchema, {
      fields: [botIntegrationSchema.integrationId],
      references: [integrationSchema.id],
    }),
  }),
);

// Types
export type SelectBotIntegration = InferSelectModel<
  typeof botIntegrationSchema
>;
export type InsertBotIntegration = InferInsertModel<
  typeof botIntegrationSchema
>;
export type zodInsertBotIntegration = InferInsertModel<
  typeof botIntegrationSchema
>;
