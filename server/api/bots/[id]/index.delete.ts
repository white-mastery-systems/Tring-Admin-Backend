export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const bot = await deleteBot(botId);

  return isValidReturnType(event, bot);
});
