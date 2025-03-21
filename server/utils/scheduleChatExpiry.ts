import { logger } from "../logger";
import { findExpiredChatsToday, updateChatSummary } from "./db/chats";

export const processExpiredChats = async () => {
  try {
    // Get expired chat IDs
    const expiredChatIds = await findExpiredChatIds();

    if (expiredChatIds.length === 0) {
      return;
    }

    // Process each expired chat
    for (const chatId of expiredChatIds) {
      await generateAndStoreChatSummary(chatId);
    }

    logger.info(
      `Successfully processed all ${expiredChatIds.length} expired chats`,
    );
  } catch (error) {
    logger.error(`Error in chat expiry processing: ${error}`);
  }
};

const findExpiredChatIds = async () => {
  try {
    // Find chats that expire today (or have already expired)
    const expiredChats = await findExpiredChatsToday();

    if (expiredChats.length === 0) {
      logger.info("No chats expired today");
      return [];
    }

    const chatIds = expiredChats.map((chat) => chat.id);
    logger.info(`Found ${chatIds.length} expired chats to process`);
    return chatIds;
  } catch (error) {
    logger.error(`Error finding expired chats: ${error}`);
    return [];
  }
};

const generateAndStoreChatSummary = async (chatId: string) => {
  try {
    // Fetch chat history
    const chatHistory = await $fetch(`/api/org/chat/${chatId}/messages`, {
      method: "GET",
    });

    // Generate chat summary
    const summaryResponse = await $fetch("/api/chat-summary", {
      method: "POST",
      body: { chatHistory },
    });

    // Update the chat record with the summary
    await updateChatSummary(chatId, summaryResponse);

    logger.info(`Updated summary for chat ${chatId}`);
  } catch (error) {
    logger.error(`Error generating summary for chat ${chatId}: ${error}`);
  }
};
