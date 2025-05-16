import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const query = await isValidQueryHandler(event, z.object({
      q: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      type: z.string().optional()
    }))
    
    const data = await getContactGroupList(organizationId, query)
     
    return data
  } catch (error: any) {
    logger.error(`Get Contact groups API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch contact groups")
  }
})