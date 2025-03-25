import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    
    const query = await isValidQueryHandler(event, z.object({
      apiKey: z.string(),
      language: z.string().optional()
    }))

    let data: any = await getElevenlabsModels(query?.apiKey)
    if(query?.language) {
      data = data.filter((i: any) => i.languages.some((j: any)=> j.name === query?.language))
    }

    data = data.map((i: any)=> ({
      model_id: i.model_id,
      name: i.name
    }))
    return data
  } catch (error: any) {
    logger.error(`TTS-integration - elevenlabs get models API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get elevenlabs models")
  }
})