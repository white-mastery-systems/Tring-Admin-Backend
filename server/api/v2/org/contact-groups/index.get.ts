import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getContactGroupLinksByOrgId } from "~/server/utils/v2/db/contact-group"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const query = await isValidQueryHandler(event, z.object({
      q: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      type: z.string().optional()
    }))

    let page, offset, limit = 0
    if(query.page && query.limit) {
      page = parseInt(query.page) 
      limit = parseInt(query.limit)
      offset = (page - 1) * limit;
    }
    
    const [contactGroupList, contactGroupLinkList] = await Promise.all([
      getContactGroupList(organizationId, query),
      getContactGroupLinksByOrgId(organizationId)
    ])
    
    const groupIdToCountMap = contactGroupLinkList.reduce((acc: Record<string, number>, link: any) => {
      acc[link.contactGroupId] = (acc[link.contactGroupId] || 0) + 1;
      return acc;
    }, {});    
  
    const contactGroups = contactGroupList.map((group: any) => ({
      ...group,
      numberOfContacts: groupIdToCountMap[group.id] || 0
    }));

    if(query?.page && query?.limit) {
      const paginatedContactGroups = contactGroups.slice(offset, offset + limit); 
      return {
        page: page,
        limit: limit,
        totalPageCount: Math.ceil(contactGroups.length/ limit) || 1,
        totalCount: contactGroups.length,
        data: paginatedContactGroups
      }
    } else {
        return contactGroups
    }
  } catch (error: any) {
    logger.error(`Get Contact groups API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch contact groups")
  }
})