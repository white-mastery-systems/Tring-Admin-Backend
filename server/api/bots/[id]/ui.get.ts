export default defineEventHandler(async (event) => {
  const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  let bot = await getBotDetailsNoCache(id);
  bot = await isValidReturnType(event, bot);

  if (!bot) return sendError(event, createError({ statusCode: 404 }));

  const availableQuota = bot.organization.maxQuota - bot.organization.usedQuota;
  // if (bot.organization.planCode === "FREE" && availableQuota <= 0)
  //   return sendError(
  //     event,
  //     createError({ statusCode: 403, statusMessage: "Trial Expired" }),
  //   );

  return (bot.metadata as Record<string, any>).ui;
});
