import { notInArray } from "drizzle-orm";

const db = useDrizzle()

export const getChatbotIntentByName = async (botId: string, intent: string, type: string, mode: string, intentId?: string) => {
  return await db.query.botIntentSchema.findFirst({
    where: and(
      eq(botIntentSchema.botId, botId),
      intent ? eq(botIntentSchema.intent, intent) : undefined,
      eq(botIntentSchema.type, type),
      mode === "update" ? ne(botIntentSchema.id, intentId) : undefined
    ),
  });
}

export const getChatbotIntentsByChatbot = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const excludedEvents = ['visit', 'leads_submitted'];

  const autoEvents = [
    "schedule_appointment",
    "schedule_call",
    "site_visit",
    "location",
    "virtual_tour",
    "images",
    "brochures"
  ];

  const rawData = await db
    .select({
      event: timelineSchema.event,
      count: sql<number>`COUNT(*)`.as("count")
    })
    .from(timelineSchema)
    .innerJoin(
      botIntentSchema,
      eq(timelineSchema.event, botIntentSchema.intent) // match event with intent name
    )
    .where(
      and(
        eq(timelineSchema.orgId, organizationId),
        ...(fromDate && toDate ? [
          gte(timelineSchema.createdAt, fromDate),
          lte(timelineSchema.createdAt, toDate),
        ] : []),
      )
    )
    .groupBy(timelineSchema.event)
    .orderBy(desc(sql`count`));

  // Add type field: "auto" or "custom"
  const dataWithType = rawData.map((item: any) => ({
    ...item,
    event: item.event.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Capitalize each word
    type: autoEvents.includes(item.event) ? "auto" : "custom"
  }));

  return dataWithType
};