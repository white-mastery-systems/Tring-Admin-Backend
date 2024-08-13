const db = useDrizzle();
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { id: documentId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const doc = await db.query.documentSchema.findFirst({
    where: eq(documentSchema.id, documentId),
    with: {
      bot: true,
    },
  });

  let INITIAL_MESSAGE = null;

  while (true) {
    try {
      const _initialMessage = await $fetch<any>(
        `/api/bot/${doc?.botId}/init-message`,
        {
          method: "POST",
          baseURL: config.botBaseUrl,
        },
      );

      JSON.parse(_initialMessage.content);
      INITIAL_MESSAGE = _initialMessage;
      break;
    } catch (e) {
      console.log(e);
      continue;
    }
  }

  await db
    .update(documentSchema)
    .set({
      status: "ready",
    })
    .where(eq(documentSchema.id, documentId));

  await db
    .update(chatBotSchema)
    .set({
      metadata: {
        ...(doc?.bot?.metadata as any),
        prompt: {
          ...(doc?.bot?.metadata as any)?.prompt,
          INITIAL_MESSAGE,
        },
      },
    })
    .where(eq(chatBotSchema.id, doc?.botId!));

  return `Document with ${documentId} processing succeeded`;
});
