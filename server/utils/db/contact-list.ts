import { InsertContactList } from "~/server/schema/admin";

const db = useDrizzle()


export const createContactList = async (contactList: InsertContactList) => {
   return (
    await db.insert(contactListSchema)
    .values(contactList)
    .returning()
   )
}

export const getContactLists = async (organizationId: string) => {
  const data = await db.query.contactListSchema.findMany({
    where: eq(contactListSchema.organizationId, organizationId)
  })
  return data
}

export const getContactListById = async (id: string) => {
  const data = await db.query.contactListSchema.findFirst({
    where: eq(contactListSchema.id, id)
  })
  return data
}

export const updateContactList = async (id: string, contactList: InsertContactList) => {
  return (
    await db.update(contactListSchema)
    .set(contactList)
    .where(eq(contactListSchema.id, id))
    .returning()
  )[0]
}

export const deleteContactList = async (id: string) => {
  return (
    await db.delete(contactListSchema).returning()
  )[0]
}