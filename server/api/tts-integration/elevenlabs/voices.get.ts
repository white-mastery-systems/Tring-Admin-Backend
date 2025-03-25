import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
      
    const query = await isValidQueryHandler(event, z.object({
      apiKey: z.string()
    }))

    let data: any = await getElevenlabsVoices(query?.apiKey)

    data = data?.voices.map((i: any) => ({
      voice_id: i.voice_id,
      name: i.name
    }))
    return data
  } catch (error: any) {
    logger.error(`TTS-integration Elevenlabs get voices API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get elevenlabs voices")
  }
})