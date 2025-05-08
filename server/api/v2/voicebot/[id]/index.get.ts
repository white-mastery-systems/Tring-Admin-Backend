import { getVoicebotById } from "~/server/utils/db/voicebots"

export default defineEventHandler(async(event) => {
  await isOrganizationAdminHandler(event)
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  
  const voicebotById = await getVoicebotById(voicebotId)
  return isValidReturnType(event, voicebotById)
})