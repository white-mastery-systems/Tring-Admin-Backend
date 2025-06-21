import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const query = await isValidQueryHandler(event, z.object({
      model: z.enum(["mistv2", "arcana", "mist"])
    }))

    let data: any = await getRimeTtsVoiceList()

    if(!data) {
      return errorResponse(event, 400, "Failed to get rime voices")
    }

    data = data[query?.model]

    const formattedData = Object.entries(data).flatMap(([lang, names]) =>
      names.map((name: any) => {
        return {
          displayName: `${name.charAt(0).toUpperCase() + name.slice(1)} - ${lang.toUpperCase()}`,
          voiceName: name
        }
      }
    ))

    return formattedData
  } catch (error: any) {
    logger.error(`Rime TTS - get Voices list API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to rime tts voices")
  }
})