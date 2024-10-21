import Queue from "bull";
import { logger } from "~/server/logger";

// Create a queue
export const campaignQueue = new Queue("campaign-queue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
  },
});

campaignQueue.process(async (job) => {
  const data = job?.data;
  try {
    logger.info(
      `Job (id: ${job?.id}, CampaignId - ${data?.campaignId}) is being processed at: ${new Date()}`,
    );
    const schedule = await scheduleEvent(
      data?.campaignDate,
      data?.campaignTime,
      data?.contactList,
      data?.body,
      data?.templateData,
    );
    if (schedule?.status) {
      logger.info({ level: "info", message: "Message scheduled..." });
    }
  } catch (error) {
    logger.error(
      `Job (id: ${job?.id}, CampaignId - ${data?.campaignId}) Process failed, err: ${JSON.stringify(error)}`,
    );
  }
});

campaignQueue.on("completed", (job) => {
  const data = job?.data;
  logger.info(
    `Job (id: ${job?.id}, CampaignId - ${data?.campaignId}) completed at: ${new Date()}`,
  );
});

campaignQueue.on("failed", (job, err) => {
  const data = job?.data;
  logger.error(
    `Job (id: ${job?.id}, CampaignId - ${data?.campaignId}) failed at: ${new Date()}, err: ${JSON.stringify(err)}`,
  );
});
