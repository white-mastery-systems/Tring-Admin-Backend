export default defineEventHandler(async(event) => {
  await isOrganizationAdminHandler(event)
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const voiceBotDelete = await updateVoiceBot(voicebotId, {
    isDeleted: true,
  })

   return isValidReturnType(event, voiceBotDelete);
})