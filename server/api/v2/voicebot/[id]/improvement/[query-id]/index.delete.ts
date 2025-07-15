import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { deleteVoiceImprovementById, getVoicebotQueryById } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { ["query-id"]: queryId } = await isValidRouteParamHandler(event, checkPayloadId("query-id"))
    
    const data = await deleteVoiceImprovementById(queryId)

    return isValidReturnType(event, data)

   } catch (error: any) {
    logger.error(`Delete Voice Improvement API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to delete voice improvement")
  }
})