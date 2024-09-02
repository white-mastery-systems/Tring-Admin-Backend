import { updateBotIntegration } from "~/server/utils/db/bot";

const zodUpdateBotIntegration = z.object({
   metadata: z.record(z.any()).optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
  );

  const { integrationId: botIntegrationId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("integrationId"),
  );
  const botIntegration: any = await isValidBodyHandler(event, zodUpdateBotIntegration);

  const updateIntegration = await updateBotIntegration(botId, botIntegrationId, botIntegration);

  return updateIntegration;
})