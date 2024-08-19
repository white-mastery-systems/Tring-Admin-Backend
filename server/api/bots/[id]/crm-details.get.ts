const db = useDrizzle();
export default defineEventHandler(async (event) => {
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const bot = await getBotDetails(botId);
  if (!bot) return sendError(event, createError({ statusCode: 404 }));

  const integration = await listIntegrations(bot.organizationId);

  const selldoIntegration = integration.find((i) => i.name === "sell-do");

  const botIntegration = await db.query.botIntegrationSchema.findFirst({
    where: and(
      eq(botIntegrationSchema.botId, botId),
      eq(botIntegrationSchema.integration, "sell-do"),
    ),
  });

  const crm = {
    ...botIntegration?.metadata!,
    ...selldoIntegration?.metadata!,
  };

  return crm;
});
