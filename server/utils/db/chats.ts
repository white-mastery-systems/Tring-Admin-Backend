import { and, lte, gte } from "drizzle-orm";
import momentTz from "moment-timezone";
import { getDateRangeForFilters } from "./leads";
import { logger } from "~/server/logger";

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
  // console.log({ query, fromDate, toDate })

  let page,
    offset,
    limit = 0;

  if (query.page && query.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let chats = await db.query.chatSchema.findMany({
    where: and(
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
      query?.botUserName === "interacted"
        ? and(eq(chatSchema.interacted, true), eq(chatSchema.mode, "live"))
        : undefined,
      query?.botUserName === "live" ? eq(chatSchema.mode, "live") : undefined,
      query?.botUserName === "preview"
        ? eq(chatSchema.mode, "preview")
        : undefined,
    ),
    with: {
      bot: {
        columns: {
          name: true,
        },
      },
      botUser: {
        where: or(
          query?.q
            ? or(
                ilike(botUserSchema.name, `%${query.q}%`),
                ilike(botUserSchema.email, `%${query.q}%`),
                ilike(botUserSchema.mobile, `%${query.q}%`),
              )
            : undefined,
        ),
      },
    },
    orderBy: [desc(chatSchema.updatedAt)],
  });

  chats = chats.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    updatedAt: momentTz(i.updatedAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if (query?.q || query?.botUserName === "with_name") {
    chats = chats.filter((i) => i.botUser !== null);
  }

  if (query?.botUserName === "without_name") {
    chats = chats.filter((i) => i.botUser === null);
  }

  if (query?.country && query?.country !== "all") {
    chats = chats.filter((i) => i.metadata?.country === query?.country);
  }

  if (query?.page && query?.limit) {
    const paginatedChats = chats.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(chats.length / limit) || 1,
      totalCount: chats.length,
      data: paginatedChats,
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
