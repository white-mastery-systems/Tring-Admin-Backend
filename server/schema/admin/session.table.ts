import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authUserSchema } from "./user.table";

export const authSessionSchema = adminSchema.table("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const sessionRelations = relations(authSessionSchema, ({ one }) => ({
  user: one(authUserSchema, {
    fields: [authSessionSchema.userId],
    references: [authUserSchema.id],
  }),
}));

// Types
export type SelectSession = InferSelectModel<typeof authSessionSchema>;
export type InsertSession = InferInsertModel<typeof authSessionSchema>;
