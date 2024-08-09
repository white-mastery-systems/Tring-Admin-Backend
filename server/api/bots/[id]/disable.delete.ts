export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  const bot = updateBotDetails(id, { documentId: null });
  return isValidReturnType(event, bot);
});
