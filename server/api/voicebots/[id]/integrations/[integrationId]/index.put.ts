import { updateVoiceBotIntegration } from "~/server/utils/db/voicebots";

const zodUpdateVoiceBotIntegration = z.object({
   metadata: z.record(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: voiceBotId } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  const { integrationId: voiceBotIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("integrationId"));
 
  const voiceBotIntegration: any = await isValidBodyHandler(event, zodUpdateVoiceBotIntegration);
 
  const update = await updateVoiceBotIntegration(voiceBotId,voiceBotIntegrationId, voiceBotIntegration);
  
  return isValidReturnType(event, update);
})