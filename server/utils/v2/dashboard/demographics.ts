import { logger } from "~/server/logger"
import { getChatLeadCountByCountry } from "../db/chats";
import { getVoiceCallLeadByCountry } from "../db/call-logs";

export const getDemographics = async (organizationId: string, type: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  try {
    let botTrafficAndLeads = type === "chat"
      ? await getChatLeadCountByCountry(organizationId, fromDate, toDate)
      : await getVoiceCallLeadByCountry(organizationId, fromDate, toDate)
 
    const data = botTrafficAndLeads.map((item: any) => {
      const interactions = type === "chat"
        ? parseInt(item.chats, 10)
        : parseInt(item.calls, 10)

      const leads = parseInt(item.leads, 10);

      const conversionRate = interactions > 0 ? ((leads / interactions) * 100).toFixed(1) : "0.0";
      return {
        ...item,
        conversionRate: `${conversionRate}%`,
      };
    });

    return data

  } catch (error: any) {
    logger.error(`Dashboard Demographics Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}