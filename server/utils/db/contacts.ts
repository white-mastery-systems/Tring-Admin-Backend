import { InsertContacts } from "~/server/schema/admin"

const db = useDrizzle()

export const createContacts = async (contacts: InsertContacts) => {
  return (
    await db.insert(contactSchema)
    .values(contacts)
    .returning()
  )[0]
}

export const getContacts = async (organizationId: string, contactListId: string, query?: any) => {
  let page, offset, limit = 0
    
  if(query?.page && query?.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }
  const data = await db.query.contactSchema.findMany({
    where: and(
      eq(contactSchema.contactListId, contactListId),
      eq(contactSchema.organizationId, organizationId)
    ),
    orderBy: [desc(contactSchema.createdAt)]
  })
  if(query?.page && query?.limit) {
     const paginatedContacts = data.slice(offset, offset + limit); 
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length/ limit) || 1,
      totalCount: data.length,
      data: paginatedContacts
    }
  } else {
      return data
  }
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
    .set({
      ...contacts,
      updatedAt: new Date()
    })
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