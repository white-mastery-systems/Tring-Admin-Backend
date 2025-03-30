import { inArray } from "drizzle-orm"
import { logger } from "~/server/logger"

const db = useDrizzle()

export const getOrgInteractedChatsForAnalytics = async(organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: chatSchema.createdAt })
  .from(chatSchema)
  .where(
    and(
       ...(fromDate && toDate ? [
        gte(chatSchema.createdAt, fromDate),
        lte(chatSchema.createdAt, toDate),
      ] : []),
      eq(chatSchema.interacted, true),
      eq(chatSchema.mode, "live"),
      eq(chatSchema.organizationId, organizationId),
    ),
  )
}

export const getOrgChatsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: chatSchema.createdAt })
  .from(chatSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
        gte(chatSchema.createdAt, fromDate),
        lte(chatSchema.createdAt, toDate),
      ] : []),
      eq(chatSchema.organizationId, organizationId),
    ),
  )
}

export const totalSessionDuration = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const interactedChats = await db
  .select({ chatId: chatSchema.id })
  .from(chatSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
        gte(chatSchema.createdAt, fromDate),
        lte(chatSchema.createdAt, toDate),
      ] : []),
      eq(chatSchema.interacted, true),
      eq(chatSchema.mode, "live"),
      eq(chatSchema.organizationId, organizationId),
    )
  );
  const chatIdList = interactedChats.map(c => c.chatId);

  const messages = await db.select({
    chatId: messageSchema.chatId,
    createdAt: messageSchema.createdAt,
  })
  .from(messageSchema).where(
    inArray(messageSchema.chatId, chatIdList)
  )
  
  // Step 1: Initialize a map to store min/max times for each chatId
  const sessionDurations: Record<string, { minTime: number; maxTime: number }> = {};

  // Step 2: Loop through messages and update min/max times
  messages.forEach(msg => {
    const timestamp = new Date(msg.createdAt).getTime(); // Convert to timestamp

    if (!sessionDurations[msg.chatId]) {
      // Initialize min and max with the first message's timestamp
      sessionDurations[msg.chatId] = { minTime: timestamp, maxTime: timestamp };
    } else {
      // Update minTime and maxTime
      sessionDurations[msg.chatId].minTime = Math.min(sessionDurations[msg.chatId].minTime, timestamp);
      sessionDurations[msg.chatId].maxTime = Math.max(sessionDurations[msg.chatId].maxTime, timestamp);
    }
  })

  const chatSessionDurations = Object.entries(sessionDurations).map(([chatId, session]) => ({
    chatId,
    duration: (session.maxTime - session.minTime) / 1000 / 60, // Convert milliseconds to seconds
  }));

  // Get total duration (sum of all session durations)
  const totalDuration = chatSessionDurations.reduce((sum, chat) => sum + chat.duration, 0);

  // Get total conversations (only chats with interaction)
  const totalConversations = interactedChats.length;

  // Calculate average session duration
  const averageSessionDuration = totalConversations ? Math.round(totalDuration / totalConversations) : 0;

  return averageSessionDuration
}

export const getAnalyticsGraph = async ({ totalConversation, period, fromDate, toDate, timeZone } : {
  totalConversation: any[],
  period: string,
  fromDate: Date | undefined,
  toDate: Date | undefined,
  timeZone: string,
}) => {
  try {
    //Graph values
    const { dates, difference } = getAllDatesInRange(
      period!,
      fromDate!,
      toDate!,
      timeZone,
    );
         
    let interactedChatsMap = null;
    const interactedChatsResult = groupAndMapData({
      module: totalConversation,
      period: period,
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
    return totalConversationGraph.interacted_chats;
  } catch (error: any) { 
    logger.error(`Dashboard - Analytics API Error: ${JSON.stringify(error)}`)
    return []
  }
}