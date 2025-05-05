import { updateBotIntent } from "~/server/utils/db/bot";

const db = useDrizzle()

const zodIntentUpdate = z.object({
  type: z.string().optional(),
  intent: z.string().optional(),
  emailRecipients: z.array(z.string()).optional(),
  isEmailEnabled: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
  link: z.string().url().min(5, "Link too short").optional(),
  uploads: z.array(z.any()).optional(),
}).refine((data) => {
  // Require `link` only when intent is "location" or "virtual_tour"
  if (["location", "virtual_tour"].includes(data?.intent)) {
    return !!data.link; 
  }
  return true;
}, {
  message: "Link is required for 'location' and 'virtual_tour' intents",
  path: ["link"],
});

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);

  const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"));
  const { intentId } = await isValidRouteParamHandler(event, checkPayloadId("intentId"));
  const body = await isValidBodyHandler(event, zodIntentUpdate);

  const existingIntent = await db.query.botIntentSchema.findFirst({
    where: and(
      eq(botIntentSchema.botId, botId),
      eq(botIntentSchema.intent, body.intent),
      eq(botIntentSchema.type, body.type),
      ne(botIntentSchema.id, intentId)
    ),
  });

  if (existingIntent) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Intent Name Already Exists: The provided intent name is already in use. Please choose a different name or check for duplicates.",
      })
    );
  }

  const previousIntent = await getIntent(intentId);
  const updatedIntent = await updateBotIntent(botId, intentId, body);

  if (
    updatedIntent.type === "schedule_form" &&
    body.metadata?.naturalConversation !== previousIntent?.metadata?.naturalConversation
  ) {
    const botDetails = await getBotDetails(botId);
    const currentTools = botDetails?.defaultTools || [];

    const updatedTools = body.metadata?.naturalConversation
      ? [...new Set([...currentTools, updatedIntent.intent])] // prevent duplicates
      : currentTools.filter((tool) => tool !== updatedIntent.intent);

    await updateBotDetails(botId, { defaultTools: updatedTools });
  }

  return updatedIntent;
});
