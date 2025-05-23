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
    
    const [contactGroupList, contactGroupLinkList] = await Promise.all([
      getContactGroupList(organizationId, query),
      getContactGroupLinksByOrgId(organizationId)
    ])
    
    const groupIdToCountMap = contactGroupLinkList.reduce((acc: Record<string, number>, link: any) => {
      acc[link.contactGroupId] = (acc[link.contactGroupId] || 0) + 1;
      return acc;
    }, {});    

    const data = contactGroupList.map((group: any) => ({
      ...group,
      numberOfContacts: groupIdToCountMap[group.id] || 0
    }));

    return data
  } catch (error: any) {
    logger.error(`Get Contact groups API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch contact groups")
  }
})