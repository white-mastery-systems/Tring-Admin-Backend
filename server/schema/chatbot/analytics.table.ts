import { relations } from "drizzle-orm";
import {
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { chatBotSchema } from "./bot.table";
import { organizationSchema } from "../admin/organization.table";

export const analyticsSchema = chatbotSchema.table("analytics", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  sessions: integer("sessions").default(0),
  uniqueSessions: integer("unique_sessions").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
  botId: uuid("bot_id").references(() => chatBotSchema.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// relation
export const analyticsRelations = relations(
  analyticsSchema,
  ({ one, many }) => ({
    organization: one(organizationSchema, {
      fields: [analyticsSchema.organizationId],
      references: [organizationSchema.id],
    }),
    bot: one(chatBotSchema, {
      fields: [analyticsSchema.botId],
      references: [chatBotSchema.id],
    }),
  }),
);