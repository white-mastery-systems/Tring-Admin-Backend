import { is } from "drizzle-orm"
import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { updateIntentsActiveStatus } from "~/server/utils/db/bot"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const body = await isValidBodyHandler(event, z.object({
      type: z.string(),
      isActive: z.boolean(),
    }))

    const { id: botId } = await isValidRouteParamHandler(event, z.object({
      id: z.string().uuid(),
    }))
    
    await updateIntentsActiveStatus(botId, body.type, body.isActive)

    return true

  } catch (error: any) {
    logger.error(`Chatbot intents activation error, ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Failed to enable/disable intent")
  }
})