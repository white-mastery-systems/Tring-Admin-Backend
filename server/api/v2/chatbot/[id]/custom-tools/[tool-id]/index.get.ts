import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    )     
    const { ["tool-id"]: customToolId } = await isValidRouteParamHandler(event, checkPayloadId("tool-id"))

    const botDetails = await getBotDetails(botId)
    if (!botDetails) {
      return errorResponse(event, 404, "Chatbot not found")
    } 
    const data = botDetails.customTools?.find((tool: any) => tool.id === customToolId)
    if (!data) {    
      return errorResponse(event, 404, "Custom tool not found")
    }
    return data 
  } catch (error: any) {
    logger.error(`Chatbot Get Custom Tools Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to fetch custom tool")
  }
})