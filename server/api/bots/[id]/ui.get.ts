export default defineCachedEventHandler(async (event) => {
  const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  let bot = await getBotDetails(id);
  bot = await isValidReturnType(event, bot);

  return (bot.metadata as Record<string, any>).ui;
});
