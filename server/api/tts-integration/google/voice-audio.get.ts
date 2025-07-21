import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { playGoogleTtsVoice } from "~/server/utils/tts-integration/google"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const query = await isValidQueryHandler(event, z.object({
      voice: z.string()
    }))

    const data = await playGoogleTtsVoice({ voice: query.voice })

    return data
  } catch (error: any) {
    logger.error(`Play Google TTS Voice API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Failed to play google voice")
  }
})