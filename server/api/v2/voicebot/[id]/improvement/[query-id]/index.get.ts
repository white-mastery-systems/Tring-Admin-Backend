import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getVoicebotQueryById } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { ["query-id"]: queryId } = await isValidRouteParamHandler(event, checkPayloadId("query-id"))
    
    const data = await getVoicebotQueryById(queryId)

    return data

   } catch (error: any) {
    logger.error(`Voicebot - get improvement queries by id API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get voicebot query")
  }
})