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
    const data = botDetails.tools.clientTools?.find((tool: any) => tool.id === clientToolId)
    if (!data) {    
      return errorResponse(event, 404, "Client tool not found")
    }
    return data 
  } catch (error: any) {
    logger.error(`Voicebot Get Client Tools by Id API Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to fetch client tool")
  }
})