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
    // Fetch chat history from API
    const chatHistory = await $fetch<{ messages: any[] }[]>(
      `/api/org/chat/${chatId}/messages`,
      {
        method: "GET",
      },
    );

    // Ensure chatHistory is not empty
    if (
      chatHistory.length === 0 ||
      !chatHistory[0].messages ||
      chatHistory[0].messages.length < 3
    ) {
      logger.info(`Chat ${chatId} has less than 3 messages. Skipping summary.`);
      return;
    }

    // At least 3 messages exist — proceed
    const summaryResponse = await $fetch("/api/chat-summary", {
      method: "POST",
      body: {
        chatHistory,
        chatId,
      },
    });

    await updateChatSummary(chatId, summaryResponse);

    logger.info(`Updated summary for chat ${chatId}`);
  } catch (error) {
    logger.error(`Error generating summary for chat ${chatId}: ${error}`);
  }
};

