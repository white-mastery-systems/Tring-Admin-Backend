import { InsertTimeline, timelineSchema } from "~/server/schema/admin";
import momentTz from "moment-timezone";

const db = useDrizzle();
export const createTimeline = async (timeline: InsertTimeline) => {
  return (await db.insert(timelineSchema).values(timeline).returning())[0];
};

export const listTimelinesByChatId = async (chatId: string, query: any, timeZone: string) => {
  let data = await db.query.timelineSchema.findMany({
    where: eq(timelineSchema.chatId, chatId),
    orderBy: [desc(timelineSchema.createdAt)],
  });

  data = data.map((i: any) => ({
    ...i,
    createdAt:  momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A")
  }))

  return data
};
