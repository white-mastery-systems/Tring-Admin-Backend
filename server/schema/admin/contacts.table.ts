import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizationSchema } from "./organization.table";
import { contactListSchema } from "./contactList.table";
import { adminSchema } from "..";

export const contactSchema = adminSchema.table("contacts", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  countryCode: varchar("country_code"),
  phone: varchar("phone"),
  contactListId: uuid("contact_list_id")
    .notNull()
    .references(() => contactListSchema.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationSchema.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectContacts = InferSelectModel<typeof contactSchema>;
export type InsertContacts = InferInsertModel<typeof contactSchema>;