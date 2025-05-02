import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => { 
  try {
    await isOrganizationAdminHandler(event)
    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    )     
    const botDetails = await getBotDetails(botId)
    if (!botDetails) {
      return errorResponse(event, 404, "Chatbot not found")
    } 
    return botDetails.customTools || []
  } catch (error: any) {
    logger.error(`Chatbot Get Custom Tools Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to fetch custom tools")
  }
})