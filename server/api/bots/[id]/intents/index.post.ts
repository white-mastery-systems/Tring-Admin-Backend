import { createBotIntent } from "~/server/utils/db/bot";

const db = useDrizzle()

export const zodInsertChatBotIntent = z.object({
  intent: z.string().min(2, "Intent too short"),
  link: z.string().url().min(5, "Link too short").optional(),
  uploads: z.array(z.any()).optional()
}).refine((data) => {
  // Require `link` only when intent is "location" or "virtual_tour"
  if (["location", "virtual_tour"].includes(data.intent)) {
    return !!data.link; 
  }
  return true;
}, {
  message: "Link is required for 'location' and 'virtual_tour' intents",
  path: ["link"],
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const body = await isValidBodyHandler(event, zodInsertChatBotIntent);

  const isAreadyExists = await db.query.botIntentSchema.findFirst({
    where: and(
      eq(botIntentSchema.botId, botId),
      eq(botIntentSchema.intent, body.intent)
    )
  })
  
  if(isAreadyExists) {
     return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Intent name already exists",
      }),
    );
  }
  const bot = await createBotIntent({
    ...body,
    botId: botId,
    organizationId,
  });
  let botDetails: any = await getBotDetails(botId);
  
  let metaData: any = botDetails?.metadata;
  metaData = {
    ...metaData,
    prompt: {
      ...metaData.prompt,
      INTENTS: `${botDetails?.metadata.prompt.INTENTS}\n-${body.intent}`,
    },
    [body.intent]: body.link,
  };

  await updateBotDetails(botId, {
    metadata: metaData,
  });
  return bot;
});
