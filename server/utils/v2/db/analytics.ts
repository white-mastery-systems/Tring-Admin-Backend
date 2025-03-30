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

      //--- Drop off rate
      const dropOffConversation = await getDropOffConversation(organizationId, fromDate, toDate)
      const totalLeads = await getOrgLeadsForAnalytics(organizationId, fromDate, toDate)

      const dropOffRate = totalLeads > 0 ? `${Math.round((dropOffConversation / totalLeads) *100)}%` : 0
      
      return {
        conversionRate,
        uniqueVisitors: uniqueVisitors.length,
        averageSessionDuration,
        totalConversation: totalConversationGraph ?? [],
        leadQualificationAccuracy: accuracy,
        reEngagementRate,
        dropOffRate: dropOffRate,
        leadComposition,
        resolutionRate: "Coming Soon",
      }
    
    }  
    
    if(query.type === "voice") {
      //--Total calls 
      const totalCallLogs = await getOrgTotalCalls(organizationId, fromDate, toDate)

      const callDuration = totalCallLogs.map((i) => Number(i.duration) || 0)

      const totalDuration = callDuration.reduce((acc, curr) => acc + curr, 0)

      const averageSessionDuration = totalCallLogs.length
      ? Math.round (totalDuration / totalCallLogs.length)
      : 0;

      const averageSessionDurationInMinutes = averageSessionDuration > 0 ? Math.round(averageSessionDuration / 60) : 0

      const totalConversationGraph = await getAnalyticsGraph({ totalConversation: totalCallLogs, period: query?.period, fromDate, toDate, timeZone})

       return {
        conversionRate: "0%",
        uniqueVisitors: 0,
        averageSessionDuration: averageSessionDurationInMinutes,
        totalConversation: totalConversationGraph,
        leadQualificationAccuracy: "0%",
        reEngagementRate: "0%",
        dropOffRate: "Coming Soon",
        leadComposition: {},
        resolutionRate: "Coming Soon",
       }
    }
    
  } catch (error: any) {
    logger.error(`Get org analytis Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}