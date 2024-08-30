import { updateBotIntent } from "~/server/utils/db/bot";
import { zodInsertChatBotIntent } from "../index.post";

export default defineEventHandler(async (event) => {
    await isOrganizationAdminHandler(event); 
    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
     );
    const { intentId } = await isValidRouteParamHandler( event, checkPayloadId("intentId"));

    const intent: any = await isValidBodyHandler(event, zodInsertChatBotIntent);

    const updateIntent = await updateBotIntent(botId, intentId, intent);

    return updateIntent;
})