import { logger } from "../logger";
import { getAllWhatsappIntegration } from "./db/integrations";
import { getOrgSubscriptionStatus, updateOrgWhatsappSessions } from "./db/organization";

interface ConversationDataPoint {
  start: number;
  end: number;
  conversation: number;
  phone_number: string;
  country: string;
  conversation_type: "REGULAR" | "FREE_TIER" | "FREE_ENTRY_POINT";
  conversation_category: "AUTHENTICATION" | "MARKETING" | "SERVICE" | "UTILITY";
  cost: number;
}

interface WhatsAppAnalytics {
  conversation_analytics: {
    data: [
      {
        data_points: ConversationDataPoint[];
      },
    ];
  };
  id: string;
}

interface AnalysisResults {
  total_period_days: number;
  total_conversations: number;
  daily_average: number;
  daily_by_category: Record<string, number>;
  daily_by_type: Record<string, number>;
}

export const getConversationCount = async (
  wabaId: string,
  accessToken: string,
) => {
  const last24Hour = getLast24HourTimestamp();

  const getConversationAnalyticsUrl = `https://graph.facebook.com/v21.0/${wabaId}?fields=conversation_analytics.start(${last24Hour.start}).end(${last24Hour.end}).granularity(DAILY).conversation_categories(["MARKETING","SERVICE"]).dimensions(["CONVERSATION_CATEGORY","CONVERSATION_TYPE","COUNTRY","PHONE"])&access_token=${accessToken}`;

  try {
    const conversationAnalyticsResponse = await $fetch(
      getConversationAnalyticsUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    logger.info(
      `conversationAnalyticsResponse ${JSON.stringify(conversationAnalyticsResponse)}`,
    );
    return getConversationDetails(
      conversationAnalyticsResponse as WhatsAppAnalytics,
    );
  } catch (err: any) {
    logger.info(`logging failed ${err.message}`);
  }
};

export const getConversationDetails = async (data: WhatsAppAnalytics) => {
  const dataPoints = data.conversation_analytics.data[0].data_points;

  const startTime = dataPoints[0].start;
  const endTime = dataPoints[0].end;
  const daysDifference = (endTime - startTime) / (24 * 60 * 60);

  let totalConversations = 0;
  const byCategory: Record<string, number> = {};
  const byType: Record<string, number> = {};

  dataPoints.forEach((point: any) => {
    const conversations = point.conversation;
    totalConversations += conversations;

    const category = point.conversation_category;
    byCategory[category] = (byCategory[category] || 0) + conversations;

    const convType = point.conversation_type;
    byType[convType] = (byType[convType] || 0) + conversations;
  });

  const dailyTotal = totalConversations / daysDifference;
  const dailyByCategory: Record<string, number> = {};
  const dailyByType: Record<string, number> = {};

  Object.entries(byCategory).forEach(([category, count]) => {
    dailyByCategory[category] = count / daysDifference;
  });

  Object.entries(byType).forEach(([type, count]) => {
    dailyByType[type] = count / daysDifference;
  });

  const analysisResults: AnalysisResults = {
    total_period_days: daysDifference,
    total_conversations: totalConversations,
    daily_average: dailyTotal,
    daily_by_category: dailyByCategory,
    daily_by_type: dailyByType,
  };

  return analysisResults;
};

function getLast24HourTimestamp(): { start: number; end: number } {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const startTimestamp = currentTimestamp - 24 * 60 * 60;

  return {
    start: startTimestamp,
    end: currentTimestamp,
  };
}


export const orgTotalWhatappSessions = async () => {
  try {
    const allAdminWhatsappIntegrations = await getAllWhatsappIntegration()

    if(!allAdminWhatsappIntegrations.length) {
      logger.error("No whatsapp intergrations are found for calculationg whatsapp session")
      return
    }

    allAdminWhatsappIntegrations.forEach(async (integration: any) => {
      try {
        const data = await getConversationCount(integration.metadata.wabaId, integration.metadata.access_token)
        if(data) {
         const newWhatsappSessionCount = data?.total_conversations || 0
         const orgSubscriptionDetail = await getOrgSubscriptionStatus(integration.org_id, "chat")

         const totalWhatsappSessionCount = (orgSubscriptionDetail?.whatsappUsedSessions || 0) + newWhatsappSessionCount 
         await updateOrgWhatsappSessions(integration.org_id, totalWhatsappSessionCount)
        }
      } catch (error) {
        logger.error(`Whatsapp getConversationCount API, Error: ${JSON.stringify(error)}`)
      }
    })
  } catch (error: any) {
    logger.error(`Error: orgTotalWhatappSessions, ${JSON.stringify(error.message)}`)
  }
}