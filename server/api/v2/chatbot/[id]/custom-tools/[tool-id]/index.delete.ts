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

    const customTool = botDetails.customTools?.find((tool: any) => tool.id === customToolId)
    if (!customTool) {    
      return errorResponse(event, 404, "Custom tool not found")
    }
    const botCustomTools = botDetails?.customTools?.filter((tool: any) => tool.id !== customToolId) || []
    const updatedBotDetails = {
      customTools: botCustomTools
    }
    await updateBotDetails(botId, updatedBotDetails)

    return "custom tool deleted successfully"
    
  } catch (error: any) {  
    logger.error(`Chatbot Delete Custom Tools Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to delete custom tool")
  }
 })