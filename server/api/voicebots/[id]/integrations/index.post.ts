import { createVoiceBotIntegration } from "~/server/utils/db/voicebots";

export const zodInsertVoiceBotIntegration = z.object({
  integrationId: z.string().uuid(),
  campaignId: z.string().optional(),
  projectId: z.string().optional(),
  pipelineId: z.string().optional(),
  pipelineObj: z.any().optional(),
  layoutObj:z.any().optional(),
  stage:z.string().optional(),
  restaurantId: z.string().optional()
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodInsertVoiceBotIntegration)
  
  const voiceBotIntegration = await createVoiceBotIntegration({
    integrationId: body.integrationId,
    botId: voicebotId,
    organizationId,
    metadata: {
      ...body,
    }
  })
  
  return isValidReturnType(event, voiceBotIntegration);
})