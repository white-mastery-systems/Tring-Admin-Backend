import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getCartesiaTtsVoiceList } from "~/server/utils/tts-integration/cartesia"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const query = await isValidQueryHandler(event, z.object({
      apiKey: z.string()
    }))

    let voiceList: any = await getCartesiaTtsVoiceList(query?.apiKey)

    voiceList = voiceList.data.map((i: any) => ({
      id: i.id,
      name: `${i.name} - ${i.language.toUpperCase()}`
    }))

    return voiceList
  } catch (error: any) {
    logger.error(`Cartesia Get voice List API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get cartesia voices")
  }
})