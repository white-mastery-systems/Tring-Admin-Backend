export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const { id: chatId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  return await getChatDetails(chatId);
});
