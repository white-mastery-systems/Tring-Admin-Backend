import { logger } from "../logger";
import { getAllWhatsappIntegration } from "./db/integrations";
import { createOrgWhatsappSessions, getOrgSubscriptionStatus, updateOrgWhatsappSessions } from "./db/organization";

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
  phoneNumber: string,

) => {
  const last24Hour = getYesterdayTimestamps();
  phoneNumber = phoneNumber.slice(1).replaceAll(" ", "")

  const getConversationAnalyticsUrl = `https://graph.facebook.com/v21.0/${wabaId}?fields=conversation_analytics.start(${last24Hour.start}).end(${last24Hour.end}).granularity(DAILY).phone_numbers([${phoneNumber}]).conversation_categories(["MARKETING","SERVICE","UTILITY"]).dimensions(["CONVERSATION_CATEGORY","CONVERSATION_TYPE","COUNTRY","PHONE"])&access_token=${accessToken}`;

  try {
    const conversationAnalyticsResponse: WhatsAppAnalytics = await $fetch(
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
    if(!conversationAnalyticsResponse.conversation_analytics) {
       logger.info(`conversationAnalyticsResponse is empty for wabaId: ${wabaId} and phone_number: ${phoneNumber}`);
       return {
        total_conversations: 0
       }
    }
    return getConversationDetails(conversationAnalyticsResponse);
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

/* TO DO
function getLast24HourTimestamp(): { start: number; end: number } {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const startTimestamp = currentTimestamp - 24 * 60 * 60;

  return {
    start: startTimestamp,
    end: currentTimestamp,
  };
}
 */ 

function getYesterdayTimestamps(): { start: number; end: number } {
  const now = new Date();
  now.setDate(now.getDate() - 1);

  const start = Math.floor(new Date(now.setHours(0, 0, 0, 0)).getTime() / 1000);
  const end = Math.floor(
    new Date(now.setHours(23, 59, 59, 999)).getTime() / 1000,
  );
  return { start, end };
}

export const orgTotalWhatappSessions = async () => {
  try {
    const allAdminWhatsappIntegrations = await getAllWhatsappIntegration()

    if(!allAdminWhatsappIntegrations.length) {
      logger.error("No whatsapp intergrations are found for calculationg whatsapp session")
      return
    }
    
    for(const integration of allAdminWhatsappIntegrations) {
      if (!integration?.metadata.pid || !integration?.metadata.access_token || !integration?.metadata.wabaId) {
        logger.error(`Skipping integration ${integration.id} due to missing metadata`);
        continue;
      }
      const phoneNumber = await getWhatsappPhonenumberByPid(integration.metadata.pid, integration.metadata.access_token);
      if(!phoneNumber) {
        logger.error(`Skipping integration ${integration.id} due to missing phonenumber`);
        continue;
      }
      const data = await getConversationCount(integration?.metadata.wabaId, integration.metadata.access_token, phoneNumber);
      const newWhatsappSessionCount = data?.total_conversations || 0
      const orgSubscriptionDetail = await getOrgSubscriptionStatus(integration.org_id, "chat")
      const totalWhatsappSessionCount = (orgSubscriptionDetail?.whatsappUsedSessions || 0) + newWhatsappSessionCount
 
      let whatsappWalletBalance = orgSubscriptionDetail?.whatsappWallet || 0
      const whatsappSessionPrice = parseFloat((newWhatsappSessionCount * 1.5).toFixed(2))
      whatsappWalletBalance = Math.max(0, parseFloat((whatsappWalletBalance - whatsappSessionPrice).toFixed(2)));
      
      // await updateOrgWhatsappSessions(integration.org_id, totalWhatsappSessionCount, whatsappWalletBalance)
      await createOrgWhatsappSessions({ 
        organizationId: integration.org_id,
        integrationId: integration.id,
        totalWhatappSessions: newWhatsappSessionCount,
      })
    }
  } catch (error: any) {
    logger.error(`Error: orgTotalWhatappSessions, ${JSON.stringify(error.message)}`)
  }
}

const getWhatsappPhonenumberByPid = async (pid: string, accessToken: string) => {
  try {
    const data: any = await $fetch(`https://graph.facebook.com/v21.0/${pid}?fields=display_phone_number`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    })
    return data?.display_phone_number
  } catch(error: any) {
    logger.error(`Error: getWhatsappPhonenumberByPid, ${JSON.stringify(error.message)}`)
  }
}