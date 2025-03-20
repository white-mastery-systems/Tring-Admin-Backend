import { logger } from "../logger";
import * as schedule from "node-schedule";
import { processExpiredChats } from "../utils/scheduleChatExpiry";

export default defineNitroPlugin(async () => {
  try {
    // Run every 15 minutes
    schedule.scheduleJob("*/15 * * * *", async () => {
      logger.info(
        "Chatbot - Running cleanup cron to fetch summaries for expired chats...",
      );
      await processExpiredChats();
      logger.info(
        "Chatbot - Successfully fetched and processed summaries for expired chats.",
      );
    });
  } catch (error: any) {
    logger.error(
      `ChatCleanup scheduler error: ${JSON.stringify(error.message)}`,
    );
  }
});
