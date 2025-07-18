import { and, lte, gte, inArray } from "drizzle-orm";
import momentTz from "moment-timezone";
import { getDateRangeForFilters } from "./leads";
import { logger } from "~/server/logger";
import { count } from "drizzle-orm/sql";
import { chatResponseImprovementSchema } from "~/server/schema/bot";

const db = useDrizzle();

export const createChat = async (chat: InsertChat) => (await db.insert(chatSchema).values(chat).returning())[0];

export const createChatMessage = async (message: InsertMessage) => (await db.insert(messageSchema).values(message).returning())[0];

export const getChatMessagesById = async (chatId: string) =>{
  return await db.query.chatSchema.findFirst({
      where: eq(chatSchema.id, chatId),
      with: { messages: { orderBy: asc(messageSchema.createdAt) } },
    });
}

export const getChatDetails = async (chatId: string) => {
  return await db.query.chatSchema.findFirst({
    where: eq(chatSchema.id, chatId),
    with: {
      botUser: true,
      bot: true,
      lead: {
        columns: { id: true, status: true },
      },
      messages: {
        orderBy: asc(messageSchema.createdAt),
      },
    },
    orderBy: desc(chatSchema.createdAt),
  });
};

export const getChatOutcome = async (chatId: string) => {
  const chat = await db.query.chatSchema.findFirst({  
    where: eq(chatSchema.id, chatId),
    columns: { 
      chatOutcome: true
    },
  }); 
  return chat?.chatOutcome || "";
};

export const getMessages = async (
  chatId: string,
  botUserId: string,
  query: any,
  timeZone: string,
) => {
  const startDateTime = momentTz().tz(timeZone).subtract(1, "hour").toDate();
  const endDateTime = momentTz().tz(timeZone).toDate();

  let list: any = await db.query.chatSchema.findMany({
    where: botUserId
      ? or(eq(chatSchema.botUserId, botUserId), eq(chatSchema.id, chatId))
      : eq(chatSchema.id, chatId),
    with: {
      botUser: true,
      bot: true,
      lead: {
        columns: { id: true, status: true },
      },
      messages: {
        where: and(
          eq(messageSchema.status, true),
          query.siteVisit === "true"
            ? between(messageSchema.createdAt, startDateTime, endDateTime)
            : undefined,
        ),
        orderBy: asc(messageSchema.createdAt),
      },
    },
    orderBy: asc(chatSchema.createdAt),
  });

  list = list?.map((i: any) => ({
    botId: i?.botId,
    chatId: i?.id,
    messages: i?.messages,
  }));

  return list;
};

export const listChats = async (
  organisationId: string,
  query: any,
  timeZone: string,
) => {
  // Period-based filtering
  let fromDate: Date | undefined;
  let toDate: Date | undefined;
  if (query?.period) {
    const queryDate = getDateRangeForFilters(query, timeZone);
    fromDate = queryDate?.from;
    toDate = queryDate?.to;
  }
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  const whereClause = and(
    eq(chatSchema.organizationId, organisationId),
    query?.channel && query?.channel !== "all"
      ? eq(chatSchema.channel, query?.channel)
      : undefined,
    query?.botId && query?.botId !== "all"
      ? eq(chatSchema.botId, query.botId)
      : undefined,
    query?.period && fromDate && toDate
      ? between(chatSchema.createdAt, fromDate, toDate)
      : undefined,
    query?.outcome && query?.outcome !== "all"
      ? eq(chatSchema.chatOutcome, query?.outcome) : undefined,
    query?.mode && query?.mode !== "all"
      ? eq(chatSchema.mode, query?.mode) : undefined,
    query?.country && query.country !== "all"
    ? sql`${chatSchema.metadata} ->> 'country' = ${query.country}`
    : undefined
  )

  const totalChatsQuery = db.select({ count: count() })
    .from(chatSchema)
    .leftJoin(botUserSchema, eq(chatSchema.botUserId, botUserSchema.id))
    .where(and(
      whereClause,
      query?.q
        ? ilike(botUserSchema.name, `%${query.q}%`)
        : undefined
    ));

  const chatFilterQuery = db.select({
    id: chatSchema.id,
    mode: chatSchema.mode,
    metadata: chatSchema.metadata,
    channel: chatSchema.channel,
    createdAt: chatSchema.createdAt,
    visitedCount: chatSchema.visitedCount,
    chatOutcome: chatSchema.chatOutcome,
    bot: {
      name: chatBotSchema.name,
    },
    botUser: {
      id: botUserSchema.id,
      name: botUserSchema.name,
      visitedCount: botUserSchema.visitedCount,
    },
  })
  .from(chatSchema)
  .leftJoin(chatBotSchema, eq(chatSchema.botId, chatBotSchema.id))
  .leftJoin(botUserSchema, eq(chatSchema.botUserId, botUserSchema.id))
  .where(and(
    whereClause,
    query?.q
      ? ilike(botUserSchema.name, `%${query.q}%`)
      : undefined
  ))
  .orderBy(desc(chatSchema.createdAt))

  if (!query?.export) {
    chatFilterQuery.limit(limit).offset(offset);
  }

  let [chats, totalChats] = await Promise.all([
    chatFilterQuery,
    totalChatsQuery
  ]);

  chats = chats.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    updatedAt: momentTz(i.updatedAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if (!query?.export) {
    const totalOrgChats = totalChats[0].count || 0
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(totalOrgChats / limit) || 1,
      totalCount: totalOrgChats,
      data: chats,
    };
  } else {
    return chats;
  }
};

export const getInteractedSessions = async (
  organizationId: string,
  startDate: Date,
  endDate: Date,
) => {
  const interactedSessions = await db.query.chatSchema.findMany({
    where: and(
      gte(chatSchema.createdAt, startDate),
      lte(chatSchema.createdAt, endDate),
      eq(chatSchema.interacted, true),
      eq(chatSchema.mode, "live"),
      eq(chatSchema.organizationId, organizationId),
    ),
  });
  return interactedSessions;
};

export const updateChatSummary = async (
  chatId: string,
  summaryResponse: string,
) => {
  try {
    await db
      .update(chatSchema)
      .set({
        chatSummary: summaryResponse,
        updatedAt: new Date(),
      })
      .where(eq(chatSchema.id, chatId));

    logger.info(`Chat summary updated for chatId: ${chatId}`);
  } catch (error) {
    logger.error(`Failed to update chat summary for chatId: ${chatId}`, error);
    throw error;
  }
};

export const findExpiredChatsToday = async () => {
  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return await db
    .select({
      id: chatSchema.id,
    })
    .from(chatSchema)
    .where(
      and(
        lte(chatSchema.chatExpiredAt, now),
        gte(chatSchema.chatExpiredAt, startOfToday),
      ),
    );
};

export const fetchWhatsappChatOrCreate = async (userId: string, botId: string, orgId: string) => {
  const chat = await db.query.chatSchema.findFirst({
    where: and(
      eq(chatSchema.botUserId, userId),
      eq(chatSchema.botId, botId),
      eq(chatSchema.channel, "whatsapp"),
    ),
    orderBy: desc(chatSchema.createdAt),
  });

  if (chat) {
    return chat;
  }

  const newChat = await createChat({
    botUserId: userId,
    botId,
    organizationId: orgId,
    channel: "whatsapp",
  });

  return newChat;
};

// Get all messages for chatbot improvement
export const getAllInadequateMessages= async () => {
  try {
    const data = await db.query.chatSchema.findMany({
      where: and(
        eq(chatSchema.isProcessed, false),
        ne(chatSchema.chatSummary, {}),
        eq(chatSchema.interacted, true)
      ),
      columns: {
        id: true,
        botId: true,
        organizationId: true,
        chatSummary: true
      }
    })

    const result = data
    .filter((item: any) => Array.isArray(item.chatSummary.inadequateMessages) && item.chatSummary.inadequateMessages.length)
    .map((item: any) => ({
      botId: item.botId,
      organizationId: item.organizationId,
      inadequateMessages: [
        {
          [item.id]: item.chatSummary.inadequateMessages,
        },
      ],
    }));

    return result
  } catch (error: any) {
    logger.error(`Get All messages by botId function Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const updateChatStatus = async (chatIds: string[], status: boolean) => {
  await db.update(chatSchema).set({
    isProcessed: status,
    updatedAt: new Date()
   }).where(
    inArray(chatSchema.id, chatIds)
   )
}

export const storeImprovedBotResponses = async (data: any) => {
  await db.insert(chatResponseImprovementSchema).values(data)
}

export const getChatbotQueriesByStatus = async(botId: string, status: "trained" | "not_trained" | "ignored", timeZone: string, query: any) => {
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data = await db.query.chatResponseImprovementSchema.findMany({
    where: and(
      eq(chatResponseImprovementSchema.botId, botId),
      eq(chatResponseImprovementSchema.status, status),
      sql`cardinality(${chatResponseImprovementSchema.instances}) > 0`,
      query?.q
        ? ilike(chatResponseImprovementSchema.title, `%${query.q}%`)  
        : undefined,
    ),
    orderBy: [
      desc(chatResponseImprovementSchema.createdAt),
      sql`cardinality(${chatResponseImprovementSchema.instances}) DESC`,
    ]
  })

  data = data.map((item: any) => ({
    ...item,
    createdAt: momentTz(item.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }))
 
  if (query?.page && query?.limit) {
    const paginatedChatbotQueries = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedChatbotQueries,
    };
  } else {
    return data
  }
}

export const updateBotQueriesById = async (id: string, data: any) => {
  await db.update(chatResponseImprovementSchema).set({
    ...data,
    updatedAt: new Date()
  })
  .where(eq(chatResponseImprovementSchema.id, id))
}

export const getBotQueriesById = async(id: string) => {
  return await db.query.chatResponseImprovementSchema.findFirst({
    where: eq(chatResponseImprovementSchema.id, id)
  })
}

export const getBotCompletedQueries = async(botId: string) => {
  return await db.query.chatResponseImprovementSchema.findMany({
    where: and(
      eq(chatResponseImprovementSchema.botId, botId),
      eq(chatResponseImprovementSchema.status, "trained")
    )
  })
}

export const deleteChatImprovementById = async (id: string) => {
  return (
    await db.delete(chatResponseImprovementSchema)
    .where(eq(chatResponseImprovementSchema.id, id))
    .returning()
  )[0]
}