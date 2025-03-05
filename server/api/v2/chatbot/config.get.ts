import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { chatbotConfiguration } from "~/server/utils/chatbotConfig"

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      type: z.string()
    }))
    const data = chatbotConfiguration.find((i)=> i.type === query?.type)
    return data
  } catch (error: any) {
    logger.error(`Get chatbot configuration by type API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch chatbot congiguration")
  }
})