import { createBotIntent } from "~/server/utils/db/bot";

const db = useDrizzle()

export const zodInsertChatBotIntent = z.object({
  type: z.enum([
    "schedule_form", 
    "location",
    "virtual_tour",
    "images",
    "brochures",
    "custom"
  ]),
  intent: z.string().min(2, "Intent too short"),
  description: z.string(),
  link: z.string().url().min(5, "Link too short").optional(),
  metadata: z.record(z.any()).optional(),
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

  const isAlreadyExists = await db.query.botIntentSchema.findFirst({
    where: and(
      eq(botIntentSchema.botId, botId),
      ilike(botIntentSchema.intent, body.intent)
    )
  })
  
  if (isAlreadyExists) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Intent Name Already Exists: The specified intent name is already in use. Please choose a different name or verify that the intent does not already exist.",
      }),
    );
  }
  
  const intentName = body?.intent.toLowerCase().replace(/\s+/g, "_")

  let customFields = body?.metadata

  if(body.type === "custom") {
    customFields = body?.metadata?.fields.map((i: any) => ({
      ...i,
      model: i.label,
      required: true,
      placeholder: i.label.charAt(0).toUpperCase() + i.label.slice(1),
      errorMessage: `Invalid ${i.label}`
    }))
  }

  const bot = await createBotIntent({
    ...body,
    ...(body.type === "custom" && { metadata: {
      fields: customFields
    }}),
    botId: botId,
    organizationId,
  });

  let botDetails: any = await getBotDetails(botId);
  
  // return botDetails
  
  let metaData: any = botDetails?.metadata;
  metaData = {
    ...metaData,
    prompt: {
      ...metaData.prompt,
      INTENTS: `${botDetails?.metadata.prompt.INTENTS}\n${intentName}`,
    },
  };

  await updateBotDetails(botId, {
    metadata: metaData,
    ...(body.type === "custom" && {
      customForms: {
        ...botDetails.customForms,
        [intentName]: customFields
      }
    })
  });
  return bot;
});
