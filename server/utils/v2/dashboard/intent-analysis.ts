import { logger } from "~/server/logger"
import { getChatbotIntentsByChatbot } from "../db/chat-intents"

export const getIntentAnalysis = async (type: string, organizationId: string) => {
  try {
    if(type === "chat") {
      const data = await getChatbotIntentsByChatbot(organizationId)
      return data
    } 

  } catch (error: any) {
    logger.error(`Dashboard Intent Analysis Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}