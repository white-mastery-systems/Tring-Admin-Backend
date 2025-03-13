import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { chatbotConfigs } from "~/server/utils/chatbotConfigs"


export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      type: z.string()
    }))

    const data = chatbotConfigs[query?.type?.toLowerCase()];

    return data ?? {}
  } catch (error: any) {
    logger.error(`Get chatbot configuration by type API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch chatbot congiguration")
  }
})