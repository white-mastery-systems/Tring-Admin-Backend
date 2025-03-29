import { logger } from "~/server/logger"
import { getLeadComposition, getOrgLeadsForAnalytics } from "./leads";
import { getOrgChatsForAnalytics, getOrgInteractedChatsForAnalytics, totalSessionDuration } from "./chats";
import { getUniqueVisitorsForAnalytics } from "./uniqueVisitors";
import { getOrgChatBotsByFilterForAnalytics, getOrgTotalChatBotsForAnalytics } from "./chatbot";
import { getCallLogsByCallStatus, getOrgTotalCalls, getOrgTotalCallsInMins, getOrgTotalVoicebots, getOrgVoicebotsByFilter, getOrgVoiceLeads } from "./voicebot";
import { getOrgReEnagedBotUsers, getOrgTotalBotUsers } from "./bot-user";

const db = useDrizzle()

const validQueryValues = [
  "leads",
  "sessions",
  "unique_visitors",
  "interacted_chats",
  "schedule_call",
  "site_visit",
  "location",
  "virtual_tour",
  "images",
  "brochures",
];

export const getOrgAnalytics = async ( 
  organizationId: string,
  query: any,
  timeZone: string,
) => {
  try {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (query?.period) {
      const queryDate = getDateRangeForFilters(query, timeZone);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;
    }

     //Graph values
    const { dates, difference } = getAllDatesInRange(
      query?.period!,
      fromDate!,
      toDate!,
      timeZone,
    );
     
    if(query.type === "chat"){
      // Performance metrics
      //--- Conversion Rate
      const qualifiedLeads = await getOrgQualifiedLeads(organizationId, fromDate, toDate)
      const totalConversation = await getOrgInteractedChatsForAnalytics(organizationId, fromDate, toDate)
  
      const conversionRate = totalConversation.length > 0 
      ? `${Math.round((qualifiedLeads / totalConversation.length) * 100)}%`
      : '0%';
  
      //--- Lead qaulification Accuracy
      const totalHighPotentialLeads = await getOrgQualifiedLeads(organizationId, fromDate, toDate, true)
      const accuracy = totalHighPotentialLeads > 0
      ? `${Math.round((qualifiedLeads / totalHighPotentialLeads) * 100)}%` 
      : 0
  
      // Engagement Metrics
      //--- Total Conversation
      let interactedChatsMap = null;
      const interactedChatsResult = groupAndMapData({
        module: totalConversation,
        period: query?.period,
        difference,
        timeZone,
      });
      interactedChatsMap = new Map(
        interactedChatsResult.map((item) => [item.date, item.count]),
      );
  
      const maps = {
        interacted_chats: interactedChatsMap,
      }
      const groupedCounts = (mapData: any) =>
        dates.map((date) => ({
          date,
          count: mapData.get(date) || 0,
        }));
      const safeGroupedCounts = (map: any) => (map ? groupedCounts(map) : {});
      const totalConversationGraph = Object.entries(maps).reduce((acc: any, [key, map]) => {
          acc[key] = safeGroupedCounts(map);
        return acc;
      }, {});
    
      //--- Unique visitors
      const uniqueVisitors = await getUniqueVisitorsForAnalytics(organizationId, fromDate, toDate)
      
      //--- Average session duration
      const averageSessionDuration = await totalSessionDuration(organizationId, fromDate, toDate)
      
      //--- Re-engaement rate
      const orgTotalBotUsers = await getOrgTotalBotUsers(organizationId, fromDate, toDate)
      const orgReEngagedBotUsers = await getOrgReEnagedBotUsers(organizationId, fromDate, toDate)

      const reEngagementRate = orgTotalBotUsers > 0 ? Math.round((orgReEngagedBotUsers / orgTotalBotUsers) * 100) : '0%'
      
      //--- Lead Composition
      const leadComposition = await getLeadComposition(organizationId, fromDate, toDate)
      
      return {
        conversionRate,
        leadQualificationAccuracy: accuracy,
        totalConversation: totalConversationGraph.interacted_chats,
        uniqueVisitors: uniqueVisitors.length,
        averageSessionDuration,
        reEngagementRate,
        leadComposition
      }
    
    }  
    
    if(query.type === "voice") {
       return {
         conversionRate: "0%",
         leadQualificationAccuracy: "0%",
         totalConversation: [],
         uniqueVisitors: 0,
         averageSessionDuration: "0",
         reEngagementRate: "0%",
         leadComposition: {}
       }
    }
    
  } catch (error: any) {
    logger.error(`Get org analytis Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}