import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const query = await isValidQueryHandler(event, zodListQuery)

    const data = await getVoicebotCacheList(botId, query)

    return data
  } catch (error: any) {
    logger.error(`Voicebot Get Caches API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch voicebot caches")
  }
})