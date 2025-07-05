import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getDocumentById } from "~/server/utils/db/document";

const db = useDrizzle()
const config = useRuntimeConfig()

const routeParamValidator = z.object({
  id: z.string().uuid(),
  doc_id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  try {
  const organizationId = (await isOrganizationAdminHandler(event) as string)

  const orgChatSubscription = await getOrgZohoSubscription(organizationId, "chat")

  if (!orgChatSubscription) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Bot Activation Failed: You cannot activate the bot because there is no active plan associated with your organization. Please ensure you have an active plan to proceed.",
      }),
    );
  }
  const { id: botId, doc_id } = await isValidRouteParamHandler(
    event,
    routeParamValidator,
  );
  const bot = await getBotDetails(botId);
  if (!bot) return sendError(event, createError({ statusCode: 404 }));

  let document;
  document = await getDocumentById(doc_id);
  document = document?.status !== "ready" ? null : document;
  if(!document) {
    return errorResponse(event, 400, "The provided document is still being processed. Please try again later.")
  }
  
  document = await isValidReturnType(event, document);

  let INITIAL_MESSAGE = null;
  let max_retries = 5;

  while (max_retries > 0) {
    try {
      const _initialMessage = await $fetch<any>(
        `/api/bot/${botId}/init-message`,
        {
          method: "POST",
          baseURL: config.public.chatBotBaseUrl,
          body: { doc_id },
        },
      );

      JSON.parse(_initialMessage.content);
      INITIAL_MESSAGE = _initialMessage as {};
      break;
    } catch (e) {
      max_retries -= 1;

      continue;
    }
  }

  if (max_retries === 0) {
    return errorResponse(event, 500, "Bot Deployment failed: could not retrieve initial message from the server.")
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
    status: "active",
  });
  } catch(error: any) {
    logger.error(`Chatbot Deploy API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to deploy chatbot")
  }
});