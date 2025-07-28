import { logger } from "~/server/logger"
import { getLeadComposition } from "./leads";
import { getAnalyticsGraph, getOrgInteractedChatsForAnalytics, totalSessionDuration } from "./chats";
import { getUniqueVisitorsForAnalytics } from "./uniqueVisitors";
import { getOrgInteractedCalls, getVoiceCallClassificationCounts, getVoiceQualificationAccuracy } from "./voicebot";

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
  
      //--- Lead qualification Accuracy
      const totalHighPotentialLeads = await getOrgQualifiedLeads(organizationId, fromDate, toDate, true)
      const accuracy = totalHighPotentialLeads > 0
      ? `${Math.round((qualifiedLeads / totalHighPotentialLeads) * 100)}%` 
      : '0%';
  
      // Engagement Metrics
      //--- Total Conversation
      const totalConversationGraph = await getAnalyticsGraph({ totalConversation, period: query?.period, fromDate, toDate, timeZone})
    
      //--- Unique visitors
      const uniqueVisitors = await getUniqueVisitorsForAnalytics(organizationId, fromDate, toDate)
      
      //--- Average session duration
      const averageSessionDuration = await totalSessionDuration(organizationId, fromDate, toDate)
      
      //--- Re-engaement rate
      const orgTotalBotUsers = await getOrgTotalChatbotUsers(organizationId, fromDate, toDate)
      const orgReEngagedBotUsers = await getOrgReEnagedChatbotUsers(organizationId, fromDate, toDate)
      const reEngagementRate = orgTotalBotUsers > 0 ? `${Math.round((orgReEngagedBotUsers / orgTotalBotUsers) * 100)}%` : '0%'
      
      //--- Lead Composition
      const leadComposition = await getLeadComposition(organizationId, fromDate, toDate)

      //--- Drop off rate
      const dropOffConversation = await getChatDropOffConversation(organizationId, fromDate, toDate)
      const totalLeads = await getOrgChatLeadsForAnalytics(organizationId, fromDate, toDate)

      const dropOffRate = totalLeads > 0 ? `${Math.round((dropOffConversation / totalLeads) *100)}%` : '0%';

  
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
      // Unique Visitors
      const uniqueCallNumbers = await getUniqueCallNumbers(organizationId, fromDate, toDate)

      // Re-enagement Rate
      const reEngagementRateForCalls = await getVoicebotEngagementMetrics(organizationId, fromDate, toDate)

      //--Total calls 
      const totalCallLogs = await getOrgTotalCalls(organizationId, fromDate, toDate)

      const callDuration = totalCallLogs.map((i) => Number(i.duration) || 0)

      const totalDuration = callDuration.reduce((acc, curr) => acc + curr, 0)

      const averageSessionDuration = totalCallLogs.length
      ? Math.round (totalDuration / totalCallLogs.length)
      : 0;

      const averageSessionDurationInMinutes = averageSessionDuration > 0 ? Math.round(averageSessionDuration / 60) : 0

      // drop off rate
      const dropOffCallConversation = await getVoiceDropoffCalls(organizationId, fromDate, toDate)
      const dropOffCallRate = totalCallLogs.length > 0 ? `${Math.round((dropOffCallConversation / totalCallLogs.length) * 100)}%` : '0%';

      // convsersation rate
      const getQualifiedCallLogs = await getQualifiedCalls(organizationId, fromDate, toDate)
      const voiceConversionRate = totalCallLogs.length > 0
      ? `${Math.round((getQualifiedCallLogs / totalCallLogs.length) * 100)}%` : '0%'
      
      // Total Conversation
      const totalConversationGraph = await getAnalyticsGraph({ totalConversation: totalCallLogs, period: query?.period, fromDate, toDate, timeZone})

      // Voice Lead qualification Accuracy
      const getVoiceQualification = await getVoiceQualificationAccuracy(organizationId, fromDate, toDate)
      const voiceQualificationAccuracy = getVoiceQualification.leadQualificationAccuracy

      // voice lead composition
      const voiceLeadComposition = await getVoiceCallClassificationCounts(organizationId, fromDate, toDate)      

      return {
        conversionRate: voiceConversionRate,
        uniqueVisitors: uniqueCallNumbers,
        averageSessionDuration: averageSessionDurationInMinutes,
        totalConversation: totalConversationGraph ?? [],
        leadQualificationAccuracy: voiceQualificationAccuracy,
        reEngagementRate: reEngagementRateForCalls.reEngagementRate,
        dropOffRate: dropOffCallRate,
        leadComposition: voiceLeadComposition,
        resolutionRate: "Coming Soon",
      }
    }
    
  } catch (error: any) {
    logger.error(`Get org analytis Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const getNewAnalytics = async (organizationId: string, query: any, timeZone: string) => {
  try {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (query?.period) {
      const queryDate = getDateRangeForFilters(query, timeZone);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;
    }

    if(query?.type === "chat") {
      const [
        chatSessions, 
        uniqueVisitors, 
        chatLeads, 
        interactedChats,
        orgTotalChatbotUsers, 
        orgReEngagedBotUsers,
        dropOffConversation
      ] = await Promise.all([
        getOrgChatsForAnalytics(organizationId, fromDate, toDate),
        getUniqueVisitorsForAnalytics(organizationId, fromDate, toDate),
        getOrgChatLeadsForAnalytics(organizationId, fromDate, toDate),
        getOrgInteractedChatsForAnalytics(organizationId, fromDate, toDate),
        getOrgTotalChatbotUsers(organizationId, fromDate, toDate),
        getOrgReEnagedChatbotUsers(organizationId, fromDate, toDate),
        getChatDropOffConversation(organizationId, fromDate, toDate)
      ])
     
      const reEngagementRate = orgTotalChatbotUsers > 0 ? `${Math.round((orgReEngagedBotUsers / orgTotalChatbotUsers) * 100)}%` : "0%"
      const dropOffRate = chatLeads > 0 ? `${Math.round((dropOffConversation / chatLeads) *100)}%` : "0%";

      return {
        sessions: chatSessions.length,
        uniqueVisitors: uniqueVisitors.length,
        leads: chatLeads,
        interactedChats: interactedChats.length,
        reEngagementRate,
        dropOffRate
      }
    }

    if(query?.type === "voice") {
      const [
        totalCalls,
        voiceleads,
        interactedCalls,
        orgVoicebotEngagement,
        dropOffCallConversation
      ] = await Promise.all([
        getOrgTotalCalls(organizationId, fromDate, toDate),
        getOrgVoiceLeads(organizationId, fromDate, toDate),
        getOrgInteractedCalls(organizationId, fromDate, toDate),
        getVoicebotEngagementMetrics(organizationId, fromDate, toDate),
        getVoiceDropoffCalls(organizationId, fromDate, toDate)
      ])

      const dropOffCallRate = totalCalls.length > 0 ? `${Math.round((dropOffCallConversation / totalCalls.length) * 100)}%` : "0%";
      
      return {
        calls: totalCalls.length,
        uniqueVistors: orgVoicebotEngagement.totalUniqueCallers,
        leads: voiceleads.length,
        interactedCalls,
        reEngagementRate: orgVoicebotEngagement.reEngagementRate || "",
        dropOffRate: dropOffCallRate
      }
    }

  } catch (error: any) {
    logger.error(`Dashboard Analytics API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error.message)
  }
}