
import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getChatbotQueriesByStatus } from "~/server/utils/db/chats"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
    
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const query = await isValidQueryHandler(event, zodListQuery)

    const data = await getChatbotQueriesByStatus(botId, "trained", timeZone, query)

    return data 
  } catch(error: any) {
    logger.error(`Get chatbot completed-queries API: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get bot completed queries")
  }
})