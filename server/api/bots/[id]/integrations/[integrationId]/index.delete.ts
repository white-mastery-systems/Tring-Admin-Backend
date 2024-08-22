export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const { integrationId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("integrationId"),
  );

  const intent = await deleteBotIntegration(botId, integrationId);

  return isValidReturnType(event, intent);
});
