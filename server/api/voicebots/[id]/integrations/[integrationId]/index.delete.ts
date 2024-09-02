import { deleteVoicebotIntegration } from "~/server/utils/db/voicebots";

export default defineEventHandler(async (event) => {
   await isOrganizationAdminHandler(event);

  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const { integrationId: voicebotIntegrationId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("integrationId"),
  );

  const voicebotIntegration = await deleteVoicebotIntegration(voicebotId, voicebotIntegrationId);
 
  return isValidReturnType(event, voicebotIntegration);
})