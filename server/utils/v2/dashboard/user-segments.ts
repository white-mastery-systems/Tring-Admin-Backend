import { logger } from "~/server/logger"
import { getVoicebotUsersBySegments } from "../db/voicebot-users"

export const getUserSegments = async (organizationId: string, type: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  try {
    // Chatbot - User Segments
    if(type === "chat") {
      const chatbotUserSegments = await getChatbotUserBySegments(organizationId, fromDate, toDate)

      return {
        frequentUsers: chatbotUserSegments.frequentUsers,
        firstTimeUsers: chatbotUserSegments.firstTimeUsers,
        highValueUsers: chatbotUserSegments.highValueUsers
      }
    } 
     
    // Voicebot - User Segments
    if (type === "voice") {
      const voicebotUserSegments = await getVoicebotUsersBySegments(organizationId, fromDate, toDate)

      return {
        frequentUsers: voicebotUserSegments.frequentUsers,
        firstTimeUsers: voicebotUserSegments.firstTimeUsers
      }
    }

  } catch (error: any) {
    logger.error(`Dashboard Get User Segments Function Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}


