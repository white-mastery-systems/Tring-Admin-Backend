import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getBotUnansweredQueries, storeImprovedBotResponses, updateChatStatus } from "~/server/utils/db/chats"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const botUnansweredQueries = await getBotUnansweredQueries(botId)

    return botUnansweredQueries
  } catch (error: any) {
    logger.error(`Get chatbot unanswered-queries API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to unanswered queries")
  }
})