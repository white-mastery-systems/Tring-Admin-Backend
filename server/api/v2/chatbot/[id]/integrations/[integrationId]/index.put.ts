import { updateBotIntegration } from "~/server/utils/db/bot";

const zodUpdateBotIntegration = z.object({
  integrationId: z.string().uuid().optional(),
  campaignId: z.string().optional(),
  projectId: z.string().optional(),
  pipelineId: z.string().optional(),
  pipelineObj: z.any().optional(),
  channelId: z.string().optional(),
  layoutObj: z.any().optional(),
  sequenceObj: z.any().optional(),
  stage: z.string().optional(),
  restaurantId: z.string().optional(),
  status: z.string().optional()
});

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
  const botIntegration: any = await isValidBodyHandler(
    event,
    zodUpdateBotIntegration,
  );

  const updateIntegration = await updateBotIntegration(
    botId,
    botIntegrationId,
    { 
      metadata: botIntegration, 
      integrationId: botIntegration.integrationId,
      status: botIntegration?.status
    }
  );

  return updateIntegration;
});
