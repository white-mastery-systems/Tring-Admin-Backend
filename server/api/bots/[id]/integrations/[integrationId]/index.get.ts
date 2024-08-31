import { getBotIntegrationById } from "~/server/utils/db/bot";

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
  
  const getBotIntegartion = await getBotIntegrationById(botId, botIntegrationId)

  return getBotIntegartion
})