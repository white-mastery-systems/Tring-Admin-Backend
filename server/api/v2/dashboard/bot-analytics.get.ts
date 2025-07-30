import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getOrgCampaignsWithMetrics } from "~/server/utils/v2/db/campaign"

export default defineEventHandler(async(event) => {
  try {
    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";

    const organizationId = await isOrganizationAdminHandler(event) as string

    const query = await isValidQueryHandler(event, z.object({
      type: z.enum(["chat", "voice"]).default("chat"),
      key: z.string(),
      period: z.string(),
      from: z
        .string()
        .datetime({ offset: true })
        .nullish()
        .transform((val) => (val ? new Date(val) : null)),
      to: z
        .string()
        .datetime({ offset: true })
        .nullish()
        .transform((val) => (val ? new Date(val) : null)),
    }))

    let data: any

    // Period-based filtering
    let fromDate: Date | undefined;
    let toDate: Date | undefined;
    if (query?.period) {
      const queryDate = getDateRangeForFilters(query, timeZone);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;
    }

    switch(query?.key) {
      case "campaigns":
        data = await getOrgCampaignsWithMetrics(organizationId, fromDate, toDate)
        break
      
      case "source":
        data = await getEnagementAndLeadMetricsBySource(organizationId)
        break

      case "intentAnalysis":
        data = await getIntentAnalysis(query?.type, organizationId, fromDate, toDate)
        break
    }

    return data
  } catch (error: any) {
    logger.error(`Dashboard get user-analytics API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get dashboard user analytics")
  }
})