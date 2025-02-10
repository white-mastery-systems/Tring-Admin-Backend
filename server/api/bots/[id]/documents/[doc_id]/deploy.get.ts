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

  const getOrgCurrentActivePlan = await db.query.orgSubscriptionSchema.findFirst({
      where: and(
        eq(orgSubscriptionSchema.organizationId, organizationId),
        eq(orgSubscriptionSchema.botType, "chat"),
        eq(orgSubscriptionSchema.status, "active")
      )
  })

  if (!getOrgCurrentActivePlan) {
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

  if (max_retries === 0)
    return sendError(event, createError({ statusCode: 500 }));

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
  } catch(error) {
    console.log(error)
  }
 
});
