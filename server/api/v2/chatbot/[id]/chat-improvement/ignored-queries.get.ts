import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
    
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const query = await isValidQueryHandler(event, zodListQuery)

    const data = await getChatbotQueriesByStatus(botId, "ignored", timeZone, query)

    return data
  } catch (error: any) {
    logger.error(`Get chatbot ignored-queries API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch ignored queries")
  }
})