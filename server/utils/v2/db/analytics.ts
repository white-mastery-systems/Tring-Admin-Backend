import { logger } from "~/server/logger"
import { getOrgLeadsForAnalytics } from "./leads";
import { getOrgChatsForAnalytics, getOrgInteractedChatsForAnalytics } from "./chats";
import { getUniqueVisitorsForAnalytics } from "./uniqueVisitors";
import { getOrgChatBotsByFilterForAnalytics, getOrgTotalChatBotsForAnalytics } from "./chatbot";
import { getCallLogsByCallStatus, getOrgTotalCalls, getOrgTotalCallsInMins, getOrgTotalVoicebots, getOrgVoicebotsByFilter, getOrgVoiceLeads } from "./voicebot";

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
    const queryArray = query?.graphValues
      ?.trim()
      ?.split(",")
      .map((value: any) => value.trim()) || ["leads", "sessions"];

    // Validate query-values
    const inValidQuery = queryArray.filter(
      (i: any) => !validQueryValues.includes(i),
    );
    if (inValidQuery.length) {
      throw new Error("Invalid query values");
    }
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (query?.period) {
      const queryDate = getDateRangeForFilters(query, timeZone);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;
    }
    
    // chats
    const leads = await getOrgLeadsForAnalytics(organizationId, fromDate, toDate)
    const chats = await getOrgChatsForAnalytics(organizationId, fromDate, toDate)
    const uniqueVisitors = await getUniqueVisitorsForAnalytics(organizationId, fromDate, toDate)
    const interactedChats = await getOrgInteractedChatsForAnalytics(organizationId, fromDate, toDate)
    const chatBots = await getOrgTotalChatBotsForAnalytics(organizationId, fromDate, toDate)
    const activeChatBots = await getOrgChatBotsByFilterForAnalytics(organizationId, fromDate, toDate, true)
    const deactiveChatBots = await getOrgChatBotsByFilterForAnalytics(organizationId, fromDate, toDate, false)
    //TODO - chats - No.of triggers

    // voice
    const voiceBots = await getOrgTotalVoicebots(organizationId, fromDate, toDate)
    const activeVoiceBots = await getOrgVoicebotsByFilter(organizationId, fromDate, toDate, true)
    const deactiveVoiceBots = await getOrgVoicebotsByFilter(organizationId, fromDate, toDate, false)
    const inboundCalls = await getOrgTotalCalls(organizationId, fromDate, toDate, "inbound")
    const outboundCalls = await getOrgTotalCalls(organizationId, fromDate, toDate, "outbound")
    const voiceLeads = await getOrgVoiceLeads(organizationId, fromDate, toDate)
    const voiceTotalCalls = await getOrgTotalCalls(organizationId, fromDate, toDate)
    const callDuration = await getOrgTotalCallsInMins(organizationId, fromDate, toDate)

    // TODO -> voice - answered_calls, unAnswered_calls, rejected_calls
    const answeredCalls = await getCallLogsByCallStatus(organizationId, fromDate, toDate, "answered")
    const unAnswerdCalls = await getCallLogsByCallStatus(organizationId, fromDate, toDate, "unanswered")
    const rejectedCalls = await getCallLogsByCallStatus(organizationId, fromDate, toDate, "rejected")

    return { 
      chatLeads: leads.length,
      chatSessions: chats.length,
      uniqueVisitors: uniqueVisitors.length,
      interactedChats: interactedChats.length,
      chatBots: chatBots.length,
      activeChatBots: activeChatBots.length,
      deactiveChatBots: deactiveChatBots.length,
      voiceBots: voiceBots.length,
      activeVoiceBots: activeVoiceBots.length,
      deactiveVoiceBots: deactiveVoiceBots.length,
      voiceTotalCalls: voiceTotalCalls.length,
      inboundCalls: inboundCalls.length,
      outboundCalls: outboundCalls.length,
      voiceLeads: voiceLeads.length,
      callDuration,
      answeredCalls: answeredCalls.length,
      unAnswerdCalls: unAnswerdCalls.length,
      rejectedCalls: rejectedCalls.length
    }
    
  } catch (error: any) {
    logger.error(`Get org analytis Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}