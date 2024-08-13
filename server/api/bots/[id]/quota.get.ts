export default defineEventHandler(async (event) => {
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const db = useDrizzle();
  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
    with: {
      organization: true,
    },
  });
  if (!bot) return sendError(event, createError({ statusCode: 404 }));

  const availableQuota = bot.organization.maxQuota - bot.organization.usedQuota;
  if (bot.organization.planCode === "FREE" && availableQuota <= 0) {
    return sendError(event, createError({ statusCode: 403 }));
  }
});
