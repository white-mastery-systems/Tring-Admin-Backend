import { logger } from "../logger";
import { getAllInadequateMessages } from "./db/chats";

export const scheduleChatbotImprovement = async () => {
  try {
    const chatbotInadequateMessages = await getAllInadequateMessages()
    
    if(!chatbotInadequateMessages.length) {
      logger.info("No inadequate messages found for chatbot improvement");
      return;
    }

    for (const messages of chatbotInadequateMessages) {
      const chatImprovementResponse : any = await $fetch(`/api/chat-improvement`, {
        method: "POST",
        body: {
          conversations: messages.inadequateMessages
        },
      });
      if (chatImprovementResponse || Array.isArray(chatImprovementResponse)) {
        const chatIds: any = [...new Set(chatImprovementResponse?.flatMap((i: any) => i.instances.map((ques: any) => ques.chatId)))];
        await updateChatStatus(chatIds, true)
        const data = chatImprovementResponse.map((i: any) => ({
          organizationId: messages.organizationId,
          botId: messages.botId,
          title: i.title,
          instances: i.instances,
          suggestions: i.suggestions
        }))
        await storeImprovedBotResponses(data)
      }
    }
    logger.info("Chatbot improvement updated successfully");
    return true
  } catch (error: any) {
    logger.error(`Schedule-chatbotImprovement Error: ${JSON.stringify(error.message)}`);
    throw new Error(`Schedule-chatbotImprovement Error: ${error.message}`);
  }
}