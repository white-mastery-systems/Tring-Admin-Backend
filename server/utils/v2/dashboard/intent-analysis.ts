import { logger } from "~/server/logger"
import { getChatbotIntentsByChatbot } from "../db/chat-intents"

export const getIntentAnalysis = async (type: string, organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  try {
    if(type === "chat" || type === "both") {
      const data = await getChatbotIntentsByChatbot(organizationId, fromDate, toDate)
      return {
        chat: data
      }
    } 

  } catch (error: any) {
    logger.error(`Dashboard Intent Analysis Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}