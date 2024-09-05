import { InsertTimeline, timelineSchema } from "~/server/schema/admin";
const db = useDrizzle();
export const createTimeline = async (timeline: InsertTimeline) => {
  return (await db.insert(timelineSchema).values(timeline).returning())[0];
};

export const listTimelinesByChatId = async (chatId: string, query: any) => {
  return await db.query.timelineSchema.findMany({
    where: eq(timelineSchema.chatId, chatId),
    orderBy: [desc(timelineSchema.createdAt)],
  });
};
