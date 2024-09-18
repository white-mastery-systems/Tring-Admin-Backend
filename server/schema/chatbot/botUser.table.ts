import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chatbotSchema } from "..";
import { organizationSchema } from "../admin/organization.table";
import { chatSchema } from "./chats.table";
import { leadSchema } from "./leads.table";
import { createInsertSchema } from "drizzle-zod";

export const botUserSchema = chatbotSchema.table(
  "bot_user",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: varchar("name", { length: 64 }).notNull(),
    email: varchar("email", { length: 128 }),
    mobile: varchar("mobile", { length: 16 }),
    metaData: jsonb("metadata"),
    visitedCount: integer("visited_count").default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    organizationId: uuid("organization_id")
      .references(() => organizationSchema.id, { onDelete: "cascade" })
      .notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  // (table) => ({
  //   emailUnique: unique("bot_user_email")
  //     .on(table.email, table.organizationId)
  //     .nullsNotDistinct(),
  //   mobileUnique: unique("bot_user_mobile")
  //     .on(table.mobile, table.organizationId)
  //     .nullsNotDistinct(),
  // }),
);

// relations
export const botUserRelations = relations(botUserSchema, ({ one, many }) => ({
  organization: one(organizationSchema, {
    fields: [botUserSchema.organizationId],
    references: [organizationSchema.id],
  }),
  chats: many(chatSchema),
  leads: many(leadSchema),
}));

// Types
export type SelectBotUser = InferSelectModel<typeof botUserSchema>;
export type InsertBotUser = InferInsertModel<typeof botUserSchema>;

export const zodInsertBotUser = createInsertSchema(botUserSchema, {
  name: (schema) =>
    schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
}).refine((data) => data.email || data.mobile, {
  message: "Either email or mobile is required",
  path: ["email", "mobile"],
});
