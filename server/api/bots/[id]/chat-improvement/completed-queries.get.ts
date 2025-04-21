
import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getBotCompletedQueries } from "~/server/utils/db/chats"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const data = await getBotCompletedQueries(botId)

    return data 
  } catch(error: any) {
    logger.error(`Get chatbot completed-queries API: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get bot completed queries")
  }
})