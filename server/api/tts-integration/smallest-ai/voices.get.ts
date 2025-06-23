import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getSmallestAiTtsVoiceList } from "~/server/utils/tts-integration/smallest-ai"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const query = await isValidQueryHandler(event, z.object({
      model: z.enum(["lightning", "lightning-large", "lightningv2"]),
      token: z.string()
    }))

    let data: any = await getSmallestAiTtsVoiceList(query.model, query?.token)
    
    data = data.voices.map((i: any) => ({
      voiceName: i.voiceId,
      displayName: i.displayName
    }))

    return data
  } catch (error: any) {
    logger.error(`Smallest-AI TTS - get Voices list API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to smallest-ai tts voices")
  }
})