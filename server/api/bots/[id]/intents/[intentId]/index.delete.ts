export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const { intentId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("intentId"),
  );

  const intent = await deleteBotIntent(botId, intentId);

  return isValidReturnType(event, intent);
});
