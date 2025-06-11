import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getDeepgramTtsModels } from "~/server/utils/tts-integration/deepgram"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const deepgramTts = await getDeepgramTtsModels()

    if(!deepgramTts || !Array.isArray(deepgramTts)) {
      return errorResponse(event, 500, "Failed to get deepgram models")
    }

    const deepgramTtsmodels = [...new Set(deepgramTts?.map((model: any) => (
      model.architecture
    )))]

    return deepgramTtsmodels

  } catch (error: any) {
    logger.error(`Get deepgram tts models error: ${JSON.stringify(error)}`)
    return errorResponse(event, 500, "Failed to Get Deepgram TTS Models", error)
  }
})