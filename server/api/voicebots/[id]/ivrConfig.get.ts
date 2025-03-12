import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    
    const voicebotDetail = await getVoicebotById(botId)
    if(!voicebotDetail?.ivrConfig) {
      return errorResponse(event, 400, "IVR configuration not added to this bot.")
    }

    const ivrConfigDetail = await getNumberIntegrationById(voicebotDetail?.ivrConfig)

    return {
      provider: ivrConfigDetail?.provider,
      exophone: voicebotDetail?.incomingPhoneNumber,
      cloudTelephonyConfig: ivrConfigDetail?.metadata
    }

  } catch (error: any) {
    logger.error(`Voicebot get ivrConfig API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get ivr-config")
  }
})