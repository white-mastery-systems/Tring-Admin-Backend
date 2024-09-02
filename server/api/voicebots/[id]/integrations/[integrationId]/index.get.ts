export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)
  const { id: voiceBotId } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  const { integrationId: voicebotIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("integrationId"))

  const getVoiceBotIntegration = await getVoiceBotIntegrationById(voiceBotId, voicebotIntegrationId)

  return getVoiceBotIntegration
})