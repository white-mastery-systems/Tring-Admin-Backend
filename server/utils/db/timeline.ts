import momentTz from "moment-timezone";

const db = useDrizzle();
export const createTimeline = async (timeline: InsertTimeline) => {
  return (await db.insert(timelineSchema).values(timeline).returning())[0];
};

export const listTimelinesByChatId = async (
  chatId: string,
  query: any,
  timeZone: string,
) => {
  let data = await db.query.timelineSchema.findMany({
    where: eq(timelineSchema.chatId, chatId),
    orderBy: [desc(timelineSchema.createdAt)],
  });

  data = data.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  return data;
};

export const getTimeLineByIntent = async (
  chatId: string,
  query: any,
  timeZone: string,
) => {
  let data: any = await db.query.timelineSchema.findFirst({
    where: and(
      eq(timelineSchema.chatId, chatId),
      eq(timelineSchema.event, query.q),
    ),
    orderBy: [desc(timelineSchema.createdAt)],
  });
  if (data && data.createdAt) {
    data.createdAt = momentTz(data.createdAt)
      .tz(timeZone)
      .format("DD MMM YYYY hh:mm A");
  }
  return data;
};
