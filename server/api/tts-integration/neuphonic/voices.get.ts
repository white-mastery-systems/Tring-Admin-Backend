import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getNeuphonicTtsVoiceList } from "~/server/utils/tts-integration/neuphonic"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const query = await isValidQueryHandler(event, z.object({
      apiKey: z.string()
    }))

    let voiceList: any = await getNeuphonicTtsVoiceList(query?.apiKey)

    voiceList = voiceList.data.voices
      .filter((i: any) => i.tags.includes("Male") || i.tags.includes("Female"))
      .map((i: any) => {
        const gender = i.tags.includes("Male") ? "Male" : "Female";
    
        return {
          id: i.id,
          name: `${i.name} - ${gender} - ${i.lang_code.toUpperCase()}`
        };
      });
  
    return voiceList
  } catch (error: any) {
    logger.error(`Neuphonic Get voice List API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get neuphonic voices")
  }
})