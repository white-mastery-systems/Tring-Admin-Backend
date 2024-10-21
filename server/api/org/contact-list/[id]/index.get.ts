import { contactListContactsSchema } from "~/server/schema/admin"

const db = useDrizzle()

const zodQueryValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event)

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const query = await isValidQueryHandler(event, zodQueryValidator)
  
  const data = await db.query.contactListContactsSchema.findMany({
    with: {
      contacts: true,
      bucket: {
        columns: {
          name: true
        }
      }
    },
    where: eq(contactListContactsSchema.contactListId, contactListId)
  })

  let page, offset, limit = 0
    
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }
  
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
})