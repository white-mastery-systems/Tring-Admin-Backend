import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getVoicebotQueriesByStatus } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event) as string
    
    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const completedQueries = await getVoicebotQueriesByStatus(voicebotId, "trained")

    return completedQueries
  } catch (error: any) {
    logger.error(`Voicebot - get completed-queries API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get completed-queries for voicebot")
  }
})