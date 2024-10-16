import { getContactLists } from "~/server/utils/db/contact-list"

const db = useDrizzle()

const zodQueryvalidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const query = await isValidQueryHandler(event, zodQueryvalidator)

  const contactList = await getContactLists(organizationId, query)

  let page, offset, limit = 0
    
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }

  const mapData = contactList.map((item) => {
     let noOfAudience = 0;
     const audience = item.contactIds ? item.contactIds.length : 0
     if(audience) {
       noOfAudience = audience
     }
     return {
      ...item,
      noOfAudience
     }
  })
  if(query?.page && query?.limit) {
     const paginatedContactList = mapData.slice(offset, offset + limit); 
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(mapData.length/ limit) || 1,
      totalCount: mapData.length,
      data: paginatedContactList
    }
  } else {
      return mapData
  }
})