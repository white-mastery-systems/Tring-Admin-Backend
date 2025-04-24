import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getInadequateMessagesByBotId, getBotUnansweredQueries, storeImprovedBotResponses, updateChatStatus } from "~/server/utils/db/chats"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const inadequateMessages = await getInadequateMessagesByBotId({
      organizationId,
      botId
    })
    
    if(inadequateMessages.length) {
      const chatImprovementResponse : any = await $fetch(`/api/chat-improvement`, {
        method: "POST",
        body: {
          conversations: inadequateMessages
        },
      });
      if (chatImprovementResponse || Array.isArray(chatImprovementResponse)) {
        const chatIds: any = [...new Set(chatImprovementResponse?.flatMap((i: any) => i.instances.flatMap((ques: any) => ques.chatId)))];
    
        await updateChatStatus(chatIds, true)
        const data = chatImprovementResponse.map((i: any) => ({
          organizationId,
          botId,
          title: i.title,
          instances: i.instances,
          suggestions: i.suggestions
        }))
        await storeImprovedBotResponses(data)
      }
    }

    const botUnansweredQueries = await getBotUnansweredQueries(botId)

    return botUnansweredQueries
  } catch (error: any) {
    logger.error(`Get chatbot unanswered-queries API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to unanswered queries")
  }
})