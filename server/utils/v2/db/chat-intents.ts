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