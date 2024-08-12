export default defineEventHandler(async (event) => {
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const bot = await getBotDetailsNoCache(botId);
  return isValidReturnType(event, bot);
});
