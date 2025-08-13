import { logger } from "~/server/logger"
import { getChatLeadCountByCountry } from "../db/chats";
import { getVoiceCallLeadByCountry } from "../db/call-logs";

export const getDemographics = async (organizationId: string, type: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  try {
    const formatData = (items: any[], mode: "chat" | "voice") => {
      return items.map(item => {
        const interactions =
          mode === "chat"
            ? parseInt(item.chats, 10)
            : parseInt(item.calls, 10);

        const leads = parseInt(item.leads, 10);
        const conversionRate =
          interactions > 0
            ? ((leads / interactions) * 100).toFixed(1)
            : "0.0";

        return {
          ...item,
          conversionRate: `${conversionRate}%`,
        };
      });
    };

    if (type === "chat") {
      const chatData = await getChatLeadCountByCountry(organizationId, fromDate, toDate);
      return { chat: formatData(chatData, "chat") };
    }

    if (type === "voice") {
      const voiceData = await getVoiceCallLeadByCountry(organizationId, fromDate, toDate);
      return { voice: formatData(voiceData, "voice") };
    }

    if (type === "both") {
      const [chatData, voiceData] = await Promise.all([
        getChatLeadCountByCountry(organizationId, fromDate, toDate),
        getVoiceCallLeadByCountry(organizationId, fromDate, toDate),
      ]);

      return {
        chat: formatData(chatData, "chat"),
        voice: formatData(voiceData, "voice"),
      };
    }
  } catch (error: any) {
    logger.error(`Dashboard Demographics Error: ${JSON.stringify(error.message)}`);
    throw new Error(error);
  }
}