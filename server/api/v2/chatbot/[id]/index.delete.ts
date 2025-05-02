
export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const bot = await updateBotDetails(botId, {
      isDeleted: true,
  })

  return isValidReturnType(event, bot);
});
