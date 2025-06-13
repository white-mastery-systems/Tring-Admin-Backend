import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getContactGroupById, getContactGroupContacts } from "~/server/utils/v2/db/contact-group"

export default defineEventHandler(async(event) => {
  try {
    await isOrganizationAdminHandler(event)

    const query = await isValidQueryHandler(event, z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      q: z.string().optional()
    }))

    const { id: contactGroupId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const data = await getContactGroupById(contactGroupId)


    const contactGroupLink = await getContactGroupContacts(contactGroupId, query)

    let page, offset, limit = 0
    
    if(query.page && query.limit) {
      page = parseInt(query.page) 
      limit = parseInt(query.limit)
      offset = (page - 1) * limit;
    }
    
    if(query?.page && query?.limit) {
      const paginatedContacts = contactGroupLink.slice(offset, offset + limit); 
      return {
        page: page,
        limit: limit,
        totalPageCount: Math.ceil(contactGroupLink.length/ limit) || 1,
        totalCount: contactGroupLink.length,
        data: {
          name: data?.groupName,
          contacts: paginatedContacts
        } 
      }
    } else {
        return {
          name: data?.groupName,
          contacts: contactGroupLink
        }
    }

  } catch (error: any) {
    logger.error(`Get Contact group by id API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch contact group")
  }
})