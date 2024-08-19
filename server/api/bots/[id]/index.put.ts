export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body: any = await isValidBodyHandler(event, zodUpdateChatBot);
  let botDetails: any = await getBotDetails(botId);
  let metaData: any = botDetails?.metadata;
  metaData = {
    ...metaData,
    ...body.metadata,
    prompt: {
      ...metaData.prompt,
      ...body?.metadata?.prompt,
    },
  };
  const bot = await updateBotDetails(botId, {
    ...body,
    ...{ metadata: metaData },
  });
  return isValidReturnType(event, bot);
});
