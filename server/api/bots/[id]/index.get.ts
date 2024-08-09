export default defineEventHandler(async (event) => {
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const bot = await getBotDetails(botId);
  return isValidReturnType(event, bot);
});
