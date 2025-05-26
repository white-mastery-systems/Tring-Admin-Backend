
import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { updateBotIntent } from "~/server/utils/db/bot";
import { getChatbotIntentByName } from "~/server/utils/v2/db/chat-intents";

const zodIntentUpdate = z.object({
  type: z.string(),
  intent: z.string().optional(),
  emailRecipients: z.array(z.string()).optional(),
  isEmailEnabled: z.boolean().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
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
  try {
    await isOrganizationAdminHandler(event);

    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"));
    const { intentId } = await isValidRouteParamHandler(event, checkPayloadId("intentId"));
    const body: any = await isValidBodyHandler(event, zodIntentUpdate);
  
    const existingIntent = await getChatbotIntentByName(
      botId,
      body?.intent,
      body?.type,
      "update",
      intentId
    )
  
    if (existingIntent) {
      return errorResponse(event, 400, "Intent Name Already Exists")
    }
  
    const updatedIntent = await updateBotIntent(botId, intentId, body);
    
    return true
    
  } catch (error: any) {
    logger.error(`Chatbot update intents API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update chatbot intents")
  }
});
