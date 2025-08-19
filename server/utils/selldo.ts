import { logger } from "~/server/logger";

export const createLeadInSellDo = async (
  notes: string,
  user: Record<string, any>,
  analytics: Record<string, any>,
  apiKey: string,
  projectId: string,
  campaignId: string,
  botSource: string,
  botSubSource: string,
) => {
  logger.info(`Sell Do - createLeadInSellDo called with apiKey: ${apiKey}, projectId: ${projectId}, campaignId: ${campaignId}, analytics: ${JSON.stringify(analytics)}, user: ${JSON.stringify(user)}, notes: ${notes}`);
  while (true) {
    try {
      const response: any = await $fetch(
        `https://app.sell.do/api/leads/create/`,
        {
          method: "POST",
          body: {
            api_key: apiKey,
            sell_do: {
              form: {
                lead: {
                  name: user.name,
                  email: user.email,
                  phone: user.mobile,
                  campaign_id: campaignId,
                  source: botSource,
                  sub_source: botSubSource,
                  project_id: projectId,
                },
                note: {
                  content: notes,
                },
              },
              campaign: { srd: projectId },
              analytics,
            },
          },
        },
      );

      logger.info(`Sell Do response: ${JSON.stringify(response)}`);

      if (response.sell_do_lead_id.length > 0) return response.sell_do_lead_id;

      await sleep(5000);
    } catch (err: any) {
      logger.error(
        `createLeadInSellDo - apiKey: ${apiKey},projectId: ${projectId},campaignId: ${campaignId},analytics: ${JSON.stringify(analytics)},user: ${JSON.stringify(user)},notes: ${notes}, error: ${JSON.stringify(err.data)}`,
      );
      await sleep(5000);
      continue;
    }
  }
};
