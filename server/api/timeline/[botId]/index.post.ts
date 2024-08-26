const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const { botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("botId"),
  );
  console.log({ botId });
  // name: (schema) =>
  //   schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
  const userId = getCookie(event, "user_id") ?? null;
  const chatId = getCookie(event, `chat_${botId}`);
  if (!chatId) {
    return "Chat not found";
  }
  let chatDetails = await getChatDetails(chatId);

  // const zodInsertTimelineSchema = z.object({
  //   metadata: z.any(),
  // });

  // // // Validate Body
  // const body = await isValidBodyHandler(event, zodInsertTimelineSchema);
  // console.log({ body, userId });
  try {
    const bot = await createTimeline({
      org_id: chatDetails?.organizationId,
      user_id: userId,
      chat_id: chatId,
      metadata: { type: "text", text: "user visited for first time" },
    });
    return userId;
  } catch (err) {}
  // return bot;
});
