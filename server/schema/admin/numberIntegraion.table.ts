import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizationSchema } from "./organization.table";
import { adminSchema } from "..";

export const numberIntegrationSchema = adminSchema.table("number_integration", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  provider: varchar("provider"),
  exoPhone: varchar("exo_phone"),
  countryCode: varchar("country_code"),
  organizationId: uuid("org_id")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectNumberIntegration = InferSelectModel<
  typeof numberIntegrationSchema
>;
export type InsertNumberIntegration = InferInsertModel<
  typeof numberIntegrationSchema
>;