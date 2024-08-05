export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body = await isValidBodyHandler(event, zodUpdateChatBot);

  const bot = await updateBotDetails(botId, body);
  return isValidReturnType(event, bot);
});
