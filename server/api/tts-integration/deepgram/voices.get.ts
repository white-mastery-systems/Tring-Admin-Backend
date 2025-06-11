import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const query = await isValidQueryHandler(event, z.object({
      model: z.string()
    }))

    const deepgramTts = await getDeepgramTtsModels()
   
    if(!deepgramTts || !Array.isArray(deepgramTts)) {
      return errorResponse(event, 500, "Failed to get deepgram models")
    }

    const deepgramTtsVoices = deepgramTts
      .filter((i: any) => i.architecture === query.model)
      .map((voice: any) => (
        `${voice.name.charAt(0).toUpperCase() + voice.name.slice(1)} ${voice.metadata.accent} (${voice.metadata.tags[0]})`
      ))

    return deepgramTtsVoices
  } catch (error: any) {
    logger.error(`Get deepgram TTS voices error: ${JSON.stringify(error)}`)
    return errorResponse(event, 500, "Failed to Get Deepgram TTS Voices", error)
  }
})