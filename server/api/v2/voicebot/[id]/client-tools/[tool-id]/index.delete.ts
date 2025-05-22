import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => { 
  try {
    await isOrganizationAdminHandler(event)
    const { id: voicebotId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    )
    const { ["tool-id"]: clientToolId } = await isValidRouteParamHandler(event, checkPayloadId("tool-id"))
    const botDetails: any = await getVoicebotById(voicebotId)
    if (!botDetails) {
      return errorResponse(event, 404, "Voicebot not found")
    }

    const clientTool = botDetails.tools.clientTools?.find((tool: any) => tool.id === clientToolId)
    if (!clientTool) {    
      return errorResponse(event, 404, "Client tool not found")
    }
    const botClientTools = botDetails.tools?.clientTools?.filter((tool: any) => tool.id !== clientToolId) || []
    const updatedBotDetails = {
      tools: {
        ...botDetails?.tools,
        clientTools: botClientTools
      }
    }
    await updateVoiceBot(voicebotId, updatedBotDetails)

    return "Client tool deleted successfully"
    
  } catch (error: any) {  
    logger.error(`Voicebot Delete Custom Tools Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to delete custom tool")
  }
 })