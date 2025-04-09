export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const query = await isValidQueryHandler(event, z.object({
    hardDelete: z.string()
  }));
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const bot = query?.hardDelete === "true"
    ? await deleteBot(botId)
    : await updateBotDetails(botId, {
      isDeleted: true,
    })

  return isValidReturnType(event, bot);
});
