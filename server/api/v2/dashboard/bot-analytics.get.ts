import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getOrgCampaignsWithMetrics } from "~/server/utils/v2/db/campaign"

export default defineEventHandler(async(event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event) as string

    const query = await isValidQueryHandler(event, z.object({
      type: z.enum(["chat", "voice"]).default("chat"),
      key: z.string()
    }))

    let data: any

    switch(query?.key) {
      case "campaigns":
        data = await getOrgCampaignsWithMetrics(organizationId)
        break
      
      case "source":
        data = await getEnagementAndLeadMetricsBySource(organizationId)
        break

      case "intentAnalysis":
        data = await getIntentAnalysis(query?.type, organizationId)
        break
    }

    return data
  } catch (error: any) {
    logger.error(`Dashboard get user-analytics API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get dashboard user analytics")
  }
})