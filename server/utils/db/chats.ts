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
    messages: i?.messages.map((msg: any) => ({
      ...msg,
      createdAt: momentTz(msg.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    })),
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
    updatedAt: chatSchema.updatedAt,
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
  .orderBy(desc(chatSchema.updatedAt))

  if (query?.export === "false") {
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

  if (query?.export === "false") {
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
    isProcessed: status
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

export const getChatImprovementsByOrgId = async (organizationId: string) => {
  const result = await db
    .select({
      total: sql<number>`COUNT(*)`,
      trained: sql<number>`COUNT(*) FILTER (WHERE ${chatResponseImprovementSchema.status} = 'trained')`,
      notTrained: sql<number>`COUNT(*) FILTER (WHERE ${chatResponseImprovementSchema.status} = 'not_trained')`,
      ignored: sql<number>`COUNT(*) FILTER (WHERE ${chatResponseImprovementSchema.status} = 'ignored')`,
      highPriority: sql<number>`COUNT(*) FILTER (WHERE cardinality(${chatResponseImprovementSchema.instances}) > 1)`,

      // Potential impacts - using COALESCE to handle null arrays and SUM to count instances
      totalImpact: sql<number>`SUM(COALESCE(cardinality(${chatResponseImprovementSchema.instances}), 0))`,
      trainedImpact: sql<number>`SUM(CASE WHEN ${chatResponseImprovementSchema.status} = 'trained' THEN COALESCE(cardinality(${chatResponseImprovementSchema.instances}), 0) ELSE 0 END)`,
      highPriorityImpact: sql<number>`SUM(CASE WHEN cardinality(${chatResponseImprovementSchema.instances}) > 1 THEN COALESCE(cardinality(${chatResponseImprovementSchema.instances}), 0) ELSE 0 END)`
    })
    .from(chatResponseImprovementSchema)
    .where(eq(chatResponseImprovementSchema.organizationId, organizationId));

  const total = result[0].total;
  const trained = result[0].trained;

  const healthScore = total > 0
    ? `${Math.round((trained / total) * 100)}%`
    : "100%";

  return {
    healthScore: {
      score: healthScore,
      potentialImpact: Number(result[0].trainedImpact),
    },
    highPriority: {
      count: Number(result[0].highPriority) || 0,
      potentialImpact: Number(result[0].highPriorityImpact) || 0,
    },
    totalImprovements: {
      count: Number(total) || 0,
      potentialImpact: Number(result[0].totalImpact) || 0,
    }
  };
};


// export const getChatImprovementsByOrgId = async (organizationId: string) => {
//   const result = await db
//     .select({
//       total: sql<number>`COUNT(*)`,
//       trained: sql<number>`COUNT(*) FILTER (WHERE ${chatResponseImprovementSchema.status} = 'trained')`,
//       notTrained: sql<number>`COUNT(*) FILTER (WHERE ${chatResponseImprovementSchema.status} = 'not_trained')`,
//       ignored: sql<number>`COUNT(*) FILTER (WHERE ${chatResponseImprovementSchema.status} = 'ignored')`,
//       highPriority: sql<number>`COUNT(*) FILTER (WHERE cardinality(${chatResponseImprovementSchema.instances}) > 1)`
//     })
//     .from(chatResponseImprovementSchema)
//     .where(eq(chatResponseImprovementSchema.organizationId, organizationId));

//   const total = result[0].total;
//   const trained = result[0].trained;

//   const healthScore = total > 0
//     ? `${Math.round((trained / total) * 100)}%`
//     : "100%"; // Default to 100 if no improvements exist

//   return {
//     totalImprovements: total,
//     trainedImprovements: trained,
//     highPriorityImprovements: result[0].highPriority,
//     healthScore
//   };
// };

export const getChatImprovementWeeklyHealthScore = async (organizationId: string, timezone: string) => {
  // Week ranges
  const currentWeekStart = momentTz.tz(timezone).startOf("isoWeek").toDate();
  const currentWeekEnd = momentTz.tz(timezone).endOf("isoWeek").toDate();

  const lastWeekStart = momentTz.tz(timezone).subtract(1, "week").startOf("isoWeek").toDate();
  const lastWeekEnd = momentTz.tz(timezone).subtract(1, "week").endOf("isoWeek").toDate();

  // Fetch improvements
  const [currentWeekImprovements, lastWeekImprovements] = await Promise.all([
    db.select().from(chatResponseImprovementSchema).where(
      and(
        eq(chatResponseImprovementSchema.organizationId, organizationId),
        gte(chatResponseImprovementSchema.createdAt, currentWeekStart),
        lte(chatResponseImprovementSchema.createdAt, currentWeekEnd)
      )
    ),
    db.select().from(chatResponseImprovementSchema).where(
      and(
        eq(chatResponseImprovementSchema.organizationId, organizationId),
        gte(chatResponseImprovementSchema.createdAt, lastWeekStart),
        lte(chatResponseImprovementSchema.createdAt, lastWeekEnd)
      )
    ),
  ]);

  // Calculate current health score
  const currentWeekTotal = currentWeekImprovements.length;
  const currentWeekTrained = currentWeekImprovements.filter(i => i.status === "trained").length;
  const currentWeekScore = currentWeekTotal > 0 ? Math.round((currentWeekTrained / currentWeekTotal) * 100) : 0;

  // Calculate last week health score
  const lastWeekTotal = lastWeekImprovements.length;
  const lastWeekTrained = lastWeekImprovements.filter(i => i.status === "trained").length;
  const lastWeekScore = lastWeekTotal > 0 ? Math.round((lastWeekTrained / lastWeekTotal) * 100) : 0;

  // Calculate growth
  const growth = currentWeekScore - lastWeekScore;
  const trend = growth >= 0 ? `+${growth}% from last week` : `${growth}% from last week`;

  return {
    healthScore: `${currentWeekScore}%`,
    trend,
    currentWeek: {
      total: currentWeekTotal,
      trained: currentWeekTrained,
    },
    lastWeek: {
      total: lastWeekTotal,
      trained: lastWeekTrained,
    }
  };
};

export const getChatbotImprovementDetailsByOrgId = async (organizationId: string, limit?: string) => {
  const chatbotImprovementQuery =  db
  .select({
    instanceCount: sql`cardinality(${chatResponseImprovementSchema.instances})`,
    id: chatResponseImprovementSchema.id, 
    title: chatResponseImprovementSchema.title,
    botName: chatBotSchema.name,
    botId: chatBotSchema.id
  })
  .from(chatResponseImprovementSchema)
  .leftJoin(chatBotSchema, eq(chatResponseImprovementSchema.botId, chatBotSchema.id))
  .where(
    and(
      eq(chatResponseImprovementSchema.organizationId, organizationId),
      sql`cardinality(${chatResponseImprovementSchema.instances}) > 0`
    )
  )
  .orderBy(
    sql`cardinality(${chatResponseImprovementSchema.instances}) DESC`,
    desc(chatResponseImprovementSchema.createdAt)
  );

  if(limit) {
    const limitNumber = parseInt(limit)
    chatbotImprovementQuery.limit(limitNumber)
  }

  return await chatbotImprovementQuery
}