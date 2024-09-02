import { listVoiceBotIntegrations } from "~/server/utils/db/voicebots";

export default defineEventHandler(async (event) => {
  const organization_id = (await isOrganizationAdminHandler(event)) as string;
  const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  const voiceBotIntegrationList = await listVoiceBotIntegrations(organization_id, voicebotId)

  return voiceBotIntegrationList
})