import { integer, jsonb, pgEnum, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { addDays, addMonths } from "date-fns";
import { organizationSchema } from "./organization.table";
import { adminSchema } from "..";
import { authUserSchema } from "./user.table";

const nextMonthDate = addMonths(new Date(), 1);
const nextMonthAndDayDate = addDays(nextMonthDate, 1);

export const statusEnum = pgEnum("status", [
  "active",
  "incomplete",
  "incomplete_expired",
  "trialing",
  "unpaid",
  "cancelled",
]);

export const paymentTypeEnum = pgEnum("type", ["subscription", "addon"]);

export const paymentSchema = adminSchema.table("payment", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUserSchema.id),
  organizationId: uuid("org_id").references(() => organizationSchema.id),
  customerId: text("customer_id").notNull(),
  plan_code: varchar("plan_code", { length: 64 }),
  amount: integer("amount").notNull().default(0),
  subscription_metadata: jsonb("subscription_metadata"),
  subscriptionId: text("subscription_id"),
  productId: text("product_id"),
  customer_metadata: jsonb("customer_metadata"),
  type: paymentTypeEnum("type").default("subscription").notNull(),
  status: statusEnum("status").default("active").notNull(),
  expiry: timestamp("expiry").default(nextMonthAndDayDate).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const billingRelations = relations(paymentSchema, ({ one }) => ({
  organization: one(organizationSchema, {
    fields: [paymentSchema.organizationId],
    references: [organizationSchema.id],
  }),
  user: one(authUserSchema, {
    fields: [paymentSchema.userId],
    references: [authUserSchema.id],
  }),
}));