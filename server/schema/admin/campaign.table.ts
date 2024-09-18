import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizationSchema } from "./organization.table";
import { adminSchema } from "..";
import { contactListSchema } from "./contactList.table";

export const campaignSchema = adminSchema.table("campaign", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  countryCode: varchar("country_code"),
  phoneNumber: varchar("phone_number"),
  campaignDate: timestamp("campaign_date"),
  campaignTime: timestamp("campaign_time"),
  type: varchar("type"),
  contactListId: uuid("contact_list_id").references(
    () => contactListSchema.id,
    { onDelete: "cascade" },
  ),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectCampaign = InferSelectModel<typeof campaignSchema>;
export type InsertCampaign = InferInsertModel<typeof campaignSchema>;