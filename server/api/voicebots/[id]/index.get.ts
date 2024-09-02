import { getVoicebotById } from "~/server/utils/db/voicebots"

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  
  const voicebotById = await getVoicebotById(organizationId, voicebotId)
  return voicebotById
})