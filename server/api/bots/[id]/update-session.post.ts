export default defineEventHandler(async (event) => {
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const db = useDrizzle();
  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
  });
  if (!bot) return sendError(event, createError({ statusCode: 404 }));
  const analyticsForBot = await db.query.analyticsSchema.findFirst({
    where: eq(analyticsSchema.botId, botId),
  });
  if (analyticsForBot) {
    return (
      await db
        .update(analyticsSchema)
        .set({ sessions: Number(analyticsForBot.sessions ?? 0) + 1 })
        .where(eq(analyticsSchema.id, analyticsForBot.id))
        .returning()
    )[0];
  } else {
    return (
      await db
        .insert(analyticsSchema)
        .values({
          botId,
          sessions: 1,
          organizationId: bot.organizationId,
        })
        .returning()
    )[0];
  }
});
