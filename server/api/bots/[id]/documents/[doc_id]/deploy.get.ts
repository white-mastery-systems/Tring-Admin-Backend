import { getDocumentById } from "~/server/utils/db/document";
const config = useRuntimeConfig();

const routeParamValidator = z.object({
  id: z.string().uuid(),
  doc_id: z.string().uuid(),
});
export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId, doc_id } = await isValidRouteParamHandler(
    event,
    routeParamValidator,
  );
  const bot = await getBotDetails(botId);
  if (!bot) return sendError(event, createError({ statusCode: 404 }));

  let document;
  document = await getDocumentById(doc_id);
  document = document?.status !== "ready" ? null : document;
  document = await isValidReturnType(event, document);

  let INITIAL_MESSAGE = null;

  while (true) {
    try {
      const _initialMessage = await $fetch<any>(
        `/api/bot/${botId}/init-message`,
        {
          method: "POST",
          baseURL: config.botBaseUrl,
          body: { doc_id },
        },
      );

      JSON.parse(_initialMessage.content);
      INITIAL_MESSAGE = _initialMessage as {};
      break;
    } catch (e) {
      console.log(e);
      continue;
    }
  }

  return await updateBotDetails(botId, {
    documentId: document.id,
    metadata: {
      ...(bot.metadata as any),
      prompt: {
        ...(bot.metadata as { prompt: any }).prompt,
        INITIAL_MESSAGE,
      },
    },
  });
});
