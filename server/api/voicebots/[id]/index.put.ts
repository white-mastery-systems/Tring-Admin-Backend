import { updateVoiceBot } from "~/server/utils/db/voicebots";
import { zodVoicebotSchema } from "../index.post";


export default defineEventHandler(async(event) => {
  await isOrganizationAdminHandler(event)
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  
  const body = await isValidBodyHandler(event, zodVoicebotSchema)

  const update = await updateVoiceBot(voicebotId, body)

  return update
})