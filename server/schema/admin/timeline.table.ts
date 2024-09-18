import { jsonb, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizationSchema } from "./organization.table";
import { botUserSchema } from "../chatbot/botUser.table";
import { chatBotSchema } from "../chatbot/bot.table";
import { adminSchema } from "..";

export const timelineSchema = adminSchema.table("timeline", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => botUserSchema.id),
  orgId: uuid("org_id").references(() => organizationSchema.id),
  chatId: uuid("chat_id"),
  botId: uuid("bot_id").references(() => chatBotSchema.id),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  event: varchar("event", { length: 64 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertTimeline = InferInsertModel<typeof timelineSchema>;
