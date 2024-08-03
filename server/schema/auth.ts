import { text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import {
  type InferSelectModel,
  type InferInsertModel,
  relations,
} from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { organizationSchema } from "./admin";
import { adminSchema } from ".";

// Table definitions
export const authUserSchema = adminSchema.table("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  username: varchar("username", { length: 64 }).notNull(),
  role: varchar("role", {
    length: 10,
    enum: ["admin", "user"],
  }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationSchema.id, { onDelete: "cascade" })
    .notNull(),
});

export const authSessionSchema = adminSchema.table("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// Relations
export const userRelations = relations(authUserSchema, ({ many, one }) => ({
  refreshTokens: many(authSessionSchema),
  organization: one(organizationSchema, {
    fields: [authUserSchema.organizationId],
    references: [organizationSchema.id],
  }),
}));

export const sessionRelations = relations(authSessionSchema, ({ one }) => ({
  user: one(authUserSchema, {
    fields: [authSessionSchema.userId],
    references: [authUserSchema.id],
  }),
}));

// Types
export type SelectRawUser = InferSelectModel<typeof authUserSchema>;
export type SelectUser = Omit<SelectRawUser, "password">;
export type InsertUser = InferInsertModel<typeof authUserSchema>;

export type SelectSession = InferSelectModel<typeof authSessionSchema>;
export type InsertSession = InferInsertModel<typeof authSessionSchema>;

// Validation
export const zodInsertUser = createInsertSchema(authUserSchema, {
  username: (schema) =>
    schema.username.min(3, "Username Too Short").max(64, "Username Too Long"),
  password: (schema) =>
    schema.password.min(6, "Password Too Short").max(64, "Password Too Long"),
  email: (schema) =>
    schema.email
      .email("Invalid email")
      .min(3, "Email Too Short")
      .max(128, "Email Too Long"),
});

export const zodUpdateUser = zodInsertUser.pick({
  username: true,
});

export const zodLogin = zodInsertUser.pick({ username: true, password: true });
export const zodSignUpSchema = zodLogin.extend({
  email: z.string().email(),
  organizationName: z.string().min(1),
  organizationDescription: z.string().optional(),
});
