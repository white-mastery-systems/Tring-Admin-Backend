import { getDateRangeForFilters } from "./leads";

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

export const listChats = async (organisationId: string, query: any) => {
    // Period-based filtering
    let fromDate: Date | undefined;
    let toDate: Date | undefined;
    if (query?.period) {
      const queryDate = getDateRangeForFilters(query)
      fromDate = queryDate?.from
      toDate = queryDate?.to
    }
    console.log({ fromDate, toDate})

  return db.query.chatSchema.findMany({
    where: and(
      eq(chatSchema.organizationId, organisationId),
      query?.botId ? eq(chatSchema.botId, query.botId) : undefined,
      query?.period && fromDate && toDate ? between(chatSchema.createdAt, fromDate, toDate) : undefined,
    ),
    with: {
      botUser: true,
    },
    orderBy: [desc(chatSchema.createdAt)],
  });
};
