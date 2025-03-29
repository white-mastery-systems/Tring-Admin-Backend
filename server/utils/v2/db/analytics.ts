import { logger } from "~/server/logger"
import { getLeadComposition } from "./leads";
import { getAnalyticsGraph, getOrgInteractedChatsForAnalytics, totalSessionDuration } from "./chats";
import { getUniqueVisitorsForAnalytics } from "./uniqueVisitors";
import { getOrgReEnagedBotUsers, getOrgTotalBotUsers } from "./bot-user";


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
      const totalConversationGraph = await getAnalyticsGraph({ totalConversation, period: query?.period, fromDate, toDate, timeZone})
    
      //--- Unique visitors
      const uniqueVisitors = await getUniqueVisitorsForAnalytics(organizationId, fromDate, toDate)
      
      //--- Average session duration
      const averageSessionDuration = await totalSessionDuration(organizationId, fromDate, toDate)
      
      //--- Re-engaement rate
      const orgTotalBotUsers = await getOrgTotalBotUsers(organizationId, fromDate, toDate)
      const orgReEngagedBotUsers = await getOrgReEnagedBotUsers(organizationId, fromDate, toDate)
      const reEngagementRate = orgTotalBotUsers > 0 ? `${Math.round((orgReEngagedBotUsers / orgTotalBotUsers) * 100)}%` : '0%'
      
      //--- Lead Composition
      const leadComposition = await getLeadComposition(organizationId, fromDate, toDate)
      
      return {
        conversionRate,
        leadQualificationAccuracy: accuracy,
        resolutionRate: "Coming Soon",
        totalConversation: totalConversationGraph ?? [],
        uniqueVisitors: uniqueVisitors.length,
        dropOffRate: "Coming Soon",
        averageSessionDuration,
        reEngagementRate,
        leadComposition
      }
    
    }  
    
    if(query.type === "voice") {
       return {
        conversionRate: "0%",
        leadQualificationAccuracy: "0%",
        resolutionRate: "Coming Soon",
        totalConversation: [],
        uniqueVisitors: 0,
        dropOffRate: "Coming Soon",
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