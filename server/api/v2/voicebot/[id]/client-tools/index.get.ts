import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => { 
  try {
    await isOrganizationAdminHandler(event)
    const { id: voicebotId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    )     
    const botDetails: any = await getVoicebotById(voicebotId)
    if (!botDetails) {
      return errorResponse(event, 404, "Voicebot not found")
    } 
    return botDetails.tools.clientTools || []
  } catch (error: any) {
    logger.error(`Voicebot Get Client Tools Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to fetch Client tools")
  }
})