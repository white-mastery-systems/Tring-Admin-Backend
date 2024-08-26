import { InsertTimeline, timelineSchema } from "~/server/schema/admin";
const db = useDrizzle();
export const createTimeline = async (timeline: InsertTimeline) => {
  return (await db.insert(timelineSchema).values(timeline).returning())[0];
};
