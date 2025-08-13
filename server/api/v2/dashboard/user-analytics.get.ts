import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getDemographics } from "~/server/utils/v2/dashboard/demographics"

export default defineEventHandler(async(event) => {
  try {
    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";

    const organizationId = await isOrganizationAdminHandler(event) as string

    const query = await isValidQueryHandler(event, z.object({
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

    const botType = await getOrgChatAndVoicebots(organizationId);

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
      case "demographics":
        data = await getDemographics(organizationId, botType, fromDate, toDate)
        break

      case "languageData":
        // Placeholder for future language data functionality
        break

      case "userSegment":
        data = await getUserSegments(organizationId, botType, fromDate, toDate)
        break
    }

    return data
  } catch (error: any) {
    logger.error(`Dashboard get user-analytics API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get dashboard user analytics")
  }
})