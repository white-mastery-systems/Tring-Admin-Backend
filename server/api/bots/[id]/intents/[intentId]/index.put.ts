import { updateBotIntent } from "~/server/utils/db/bot";

const db = useDrizzle()

const zodIntentUpdate = z.object({
  intent: z.string().optional(),
  emailRecipients: z.array(z.string()).optional(),
  isEmailEnabled: z.boolean().optional(),
  link: z.string().url().min(5, "Link too short").optional(),
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
    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
     );
    const { intentId } = await isValidRouteParamHandler( event, checkPayloadId("intentId"));

    const body: any = await isValidBodyHandler(event, zodIntentUpdate);

    const isAreadyExists = await db.query.botIntentSchema.findFirst({
      where: and(
        eq(botIntentSchema.botId, botId),
        eq(botIntentSchema.intent, body.intent),
        ne(botIntentSchema.id, intentId)
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

  

    const updateIntent = await updateBotIntent(botId, intentId, body);

    return updateIntent;
})