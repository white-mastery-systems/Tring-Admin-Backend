import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getNewCampaignList } from "~/server/utils/v2/db/campaign"

const zodCampaignQueryValidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";

    const query = isValidQueryHandler(event, zodCampaignQueryValidator)

    const data = await getNewCampaignList(organizationId, query, timeZone)
    
    return data

  } catch (error: any) {
    logger.error(`Get Campaign List API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch campaign list")
  }
})