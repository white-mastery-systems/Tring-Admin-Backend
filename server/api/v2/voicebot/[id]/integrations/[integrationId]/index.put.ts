import { updateVoiceBotIntegration } from "~/server/utils/db/voicebots";

const zodUpdateVoiceBotIntegration = z.object({
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
  departments: z.array(z.any()).optional(),
  whatsappIntegrationIds: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: voiceBotId } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  const { integrationId: voiceBotIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("integrationId"));
 
  const voiceBotIntegration: any = await isValidBodyHandler(event, zodUpdateVoiceBotIntegration);
 
  const update = await updateVoiceBotIntegration(
    voiceBotId,
    voiceBotIntegrationId,
     { 
      metadata: voiceBotIntegration, 
      integrationId: voiceBotIntegration.integrationId,
      status: voiceBotIntegration.status
    });
  
  return isValidReturnType(event, update);
})