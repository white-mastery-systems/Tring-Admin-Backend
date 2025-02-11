export default defineEventHandler(async (event) => {
  const { id: chatId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  return await getChatDetails(chatId);
});
