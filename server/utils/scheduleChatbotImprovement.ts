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
      logger.info(`Processing bot: ${messages.botId}`);

      try {
        const chatImprovementResponse: any = await $fetch(`/api/chat-improvement`, {
          method: "POST",
          body: {
            conversations: messages.inadequateMessages,
          },
        });

        logger.info(`Improvement response received for bot ${messages.botId}`);

        if (Array.isArray(chatImprovementResponse) && chatImprovementResponse.length) {
          const chatIds = [...new Set(chatImprovementResponse.flatMap((i: any) => i.instances.map((ques: any) => ques.chatId)))];

          await updateChatStatus(chatIds, true);
          logger.info(`Updated chat statuses for bot ${messages.botId}`);

          const data = chatImprovementResponse.map((i: any) => ({
            organizationId: messages.organizationId,
            botId: messages.botId,
            title: i.title,
            instances: i.instances,
            suggestions: i.suggestions,
          }));

          await storeImprovedBotResponses(data);
          logger.info(`Stored improvements for bot ${messages.botId}`);
        } else {
          logger.warn(`Empty or invalid response from chat improvement API for bot ${messages.botId}`);
        }
      } catch (innerErr: any) {
        logger.error(`Chat Improvement API Error for bot ${messages.botId}: ${innerErr.message}`);
        continue; // Continue to the next bot even if this one fails
      }
    }

    logger.info("Chatbot improvement process completed successfully");
    return true;

  } catch (error: any) {
    logger.error(`Schedule-chatbotImprovement Error: ${JSON.stringify(error.message)}`);
    throw new Error(`Schedule-chatbotImprovement Error: ${error.message}`);
  }
}