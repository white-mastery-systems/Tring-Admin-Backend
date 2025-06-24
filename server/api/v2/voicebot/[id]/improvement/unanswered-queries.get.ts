import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getVoicebotQueriesByStatus } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const unansweredQueries = await getVoicebotQueriesByStatus(voicebotId, "not_trained")

    return unansweredQueries
    
  } catch (error: any) {
    logger.error(`Voicebot - get unanswered queries API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get unanswered-queries for voicebot")
  }
})