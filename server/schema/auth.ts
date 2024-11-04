import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import { jsonb, text, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { adminSchema } from ".";
import { organizationSchema, paymentSchema } from "./admin";

type permissionsItem = {
  // key: string;
  // value: number;
};

// User Role table
export const authUserRoleSchema = adminSchema.table("user_role", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  organizationId: uuid("organization_id").references(
    () => organizationSchema.id,
    { onDelete: "cascade" },
  ),
  permissions: jsonb("permissions").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
// Table definitions
export const authUserSchema = adminSchema.table("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  username: varchar("username", { length: 64 }),
  countryCode: varchar("country_code"),
  mobile: varchar("mobile"),
  role: varchar("role", {
    length: 10,
    enum: ["admin", "user"],
  }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  metadata: jsonb("metadata"),
  address: jsonb("address").default({}),
  organizationId: uuid("organization_id").references(
    () => organizationSchema.id,
    { onDelete: "cascade" },
  ),
  isVerified: boolean("is_verified").default(false),
  customerId: varchar("customer_id"),
  contactPersonId: varchar("contact_person_id"),
  roleId: uuid("role_id").references(() => authUserRoleSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userOTPSchema = adminSchema.table("otp", {
  id: uuid("id").primaryKey().defaultRandom(),
  otp: jsonb("otp"),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Relations
export const userRelations = relations(authUserSchema, ({ many, one }) => ({
  refreshTokens: many(authSessionSchema),
  organization: one(organizationSchema, {
    fields: [authUserSchema.organizationId],
    references: [organizationSchema.id],
  }),
  billsPaid: many(paymentSchema),
  userRole: one(authUserRoleSchema, {
    fields: [authUserSchema.roleId],
    references: [authUserRoleSchema.id],
  })
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

export type InsertUserRole = InferInsertModel<typeof authUserRoleSchema>;
export type SelectUserRole = InferInsertModel<typeof authUserRoleSchema>;

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

export const zodLogin = zodInsertUser
  .pick({ email: true, password: true })
  .required();
export const zodSignUpSchema = zodLogin;
