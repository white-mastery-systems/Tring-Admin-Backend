import { updateBotIntent } from "~/server/utils/db/bot";
// import { zodInsertChatBotIntent } from "../index.post";

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

    const intent: any = await isValidBodyHandler(event, zodIntentUpdate);

    const updateIntent = await updateBotIntent(botId, intentId, intent);

    return updateIntent;
})