import momentTz from "moment-timezone";
import { getDateRangeForFilters } from "./leads";
import { count } from "drizzle-orm";

const db = useDrizzle();

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

export const listChats = async (
  organisationId: string,
  query: any,
  timeZone: string,
) => {
  // Period-based filtering
  let fromDate: Date | undefined;
  let toDate: Date | undefined;
  if (query?.period) {
    const queryDate = getDateRangeForFilters(query);
    fromDate = queryDate?.from;
    toDate = queryDate?.to;
  }
  // console.log({ query, fromDate, toDate })

  let page, offset, limit = 0
    
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }

  let chats = await db.query.chatSchema.findMany({
    where: and(
      eq(chatSchema.organizationId, organisationId),
      query?.botId && query?.botId !== "all" ? eq(chatSchema.botId, query.botId) : undefined,
      query?.period && fromDate && toDate
        ? between(chatSchema.createdAt, fromDate, toDate)
        : undefined,
      query?.botUserName === "interacted"
        ? eq(chatSchema.interacted, true)
        : undefined,
      query?.botUserName === "live"
        ? eq(chatSchema.mode, "live")
        : undefined,
      query?.botUserName === "preview"
        ? eq(chatSchema.mode, "preview")
        : undefined,
    ),
    with: {
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
    orderBy: [desc(chatSchema.createdAt)],
  });

  chats = chats.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if (query?.q || query?.botUserName === "with_name") {
    chats = chats.filter((i) => i.botUser !== null);
  }

  if (query?.botUserName === "without_name") {
    chats = chats.filter((i) => i.botUser === null);
  }
  if(query?.page && query?.limit) {
     const paginatedChats = chats.slice(offset, offset + limit); 
    return {
      calls: "chats",
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(chats.length/ limit) || 1,
      totalCount: chats.length,
      data: paginatedChats
    }
  } else {
      return chats
  }
};
