import { deleteVoiceBot } from "~/server/utils/db/voicebots";

export default defineEventHandler(async(event) => {
  await isOrganizationAdminHandler(event)
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const voiceBotDelete = await deleteVoiceBot(voicebotId)

  return voiceBotDelete
})