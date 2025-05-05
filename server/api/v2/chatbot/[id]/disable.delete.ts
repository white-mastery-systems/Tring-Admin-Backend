export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  const bot = updateBotDetails(id, { status: "inactive" });
  return isValidReturnType(event, bot);
});
