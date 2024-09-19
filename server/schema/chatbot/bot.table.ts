import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  jsonb,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizationSchema } from "../admin/organization.table";
import { createInsertSchema } from "drizzle-zod";
import { chatbotSchema } from "..";
import { documentSchema } from "./document.table"
import { chatSchema } from "./chats.table";

export const chatBotSchema = chatbotSchema.table("bot", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  documentId: uuid("document_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata").default({
    ui: {
      color: "236 61% 54%",
      secondaryColor: "236, 61%, 74%",
      widgetPosition: "Right",
    },
    prompt: {},
    crm: {},
    channel: {},
  }),
  channels: jsonb("channels").default({ whatsapp: {} }),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const chatBotRelations = relations(chatBotSchema, ({ one, many }) => ({
  organization: one(organizationSchema, {
    fields: [chatBotSchema.organizationId],
    references: [organizationSchema.id],
  }),
  documents: many(documentSchema),
  chats: many(chatSchema),
  leads: many(leadSchema),
}));

// Types
export type SelectChatBot = Omit<
  InferSelectModel<typeof chatBotSchema>,
  "metadata"
> & { metadata: Record<string, any> };
export type InsertChatBot = InferInsertModel<typeof chatBotSchema>;

// Validations
export const zodInsertChatBot = createInsertSchema(chatBotSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
});

export const zodUpdateChatBot = zodInsertChatBot
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
  })
  .partial();