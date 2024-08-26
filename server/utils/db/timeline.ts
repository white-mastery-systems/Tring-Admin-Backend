import { InsertTimeline, timelineSchema } from "~/server/schema/admin";
const db = useDrizzle();
export const createTimeline = async (timeline: InsertTimeline) => {
  return (await db.insert(timelineSchema).values(timeline).returning())[0];
};

export const listTimelinesByChatId = async (chatId: string, query: any) => {
  console.log({ chatId });
  return await db.query.timelineSchema.findMany({
    where: eq(timelineSchema.chat_id, chatId),
  });
};
