import { InsertContacts } from "~/server/schema/admin"

const db = useDrizzle()

export const createContacts = async (contacts: InsertContacts) => {
  return (
    await db.insert(contactSchema)
    .values(contacts)
    .returning()
  )[0]
}

export const getContacts = async (organizationId: string, contactListId: string) => {
  const data = await db.query.contactSchema.findMany({
    where: and(
      eq(contactSchema.contactListId, contactListId),
      eq(contactSchema.organizationId, organizationId)
    )
  })
  return data
}

export const getContactsById = async (id: string) => {
  const data = await db.query.contactSchema.findFirst({
    where: eq(contactSchema.id, id)
  })
  return data
}

export const updateContacts = async (id: string, contacts: InsertContacts) => {
  return (
    await db.update(contactSchema)
    .set(contacts)
    .where(
      eq(contactSchema.id, id)
    )
    .returning()
  )[0]
}

export const deleteContacts = async (id: string) => {
  return (
    await db.delete(contactSchema)
    .where(
      eq(contactSchema.id, id)
    )
    .returning()
  )[0]
}