import { inArray } from "drizzle-orm"
import { contactGroupLinkSchema, contactGroupSchema, InsertContactGroup, InsertContactGroupLink } from "~/server/schema/admin"

const db = useDrizzle()

export const createContactGroup = async (data: InsertContactGroup) => {
  return (await db.insert(contactGroupSchema).values(data).returning())[0]
}

export const getContactGroupList = async (organizationId: string, query: any) => {
  const data = await db.query.contactGroupSchema.findMany({
    where: and(
      eq(contactGroupSchema.organizationId, organizationId),
      query?.q ?
        ilike(contactGroupSchema.groupName, `%${query.q}%`)
      : undefined,
    ),
    orderBy: [desc(contactGroupSchema.createdAt)],
  });
  return data
}

export const getContactGroupByName = async (groupName: string, organizationId: string, mode: string, contactGroupId?: string) => {
  return await db.query.contactGroupSchema.findFirst({
    where: and(
      eq(contactGroupSchema.organizationId, organizationId),
      ilike(contactGroupSchema.groupName, groupName),
      (mode === "update" ? ne(contactGroupSchema.id, contactGroupId) : undefined)
    )
  })
}

export const getContactGroupById = async(contactGroupId: string) => {
  return await db.query.contactGroupSchema.findFirst({
    where: eq(contactGroupSchema.id, contactGroupId)
  })
}

export const updateContactGroupById = async (contactGroupId: string, data: Partial<InsertContactGroup>) => {
  return (
    await db.update(contactGroupSchema).set({
    ...data,
    updatedAt: new Date()
    }).where(eq(contactGroupSchema.id, contactGroupId))
    .returning()
  )[0]
}

export const deleteContactGroupById = async (contactGroupId: string) => {
  return (await db.delete(contactGroupSchema).where(
    eq(contactGroupSchema.id, contactGroupId)
  ).returning())[0]
}


// Contact Group Links

export const createContactGroupLinks = async (data: InsertContactGroupLink) => {
  return (await db.insert(contactGroupLinkSchema).values(data).returning())
}

export const getContactLinksByContactGroupId = async (contactGroupId: string, contactIds: string[]) => {
  return await db.query.contactGroupLinkSchema.findMany({
    where: and(
      inArray(contactGroupLinkSchema.contactId, contactIds),
      eq(contactGroupLinkSchema.contactGroupId, contactGroupId)
    ),
    columns: {
      contactId: true
    }
  })
}

export const getContactGroupLinksByOrgId = async (organizationId: string) => {
  return await db.query.contactGroupLinkSchema.findMany({
    where: eq(contactGroupLinkSchema.organizationId, organizationId)
  })
}
export const getContactListByContactGroupIds = async (contactGroupIds: string[]) => {
  return await db.query.contactGroupLinkSchema.findMany({
    with: {
      contact: true
    },
    where: inArray(contactGroupLinkSchema.contactGroupId, contactGroupIds)
  })
}