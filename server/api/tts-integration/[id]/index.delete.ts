export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: ttsIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await deleteTtsIntegration(ttsIntegrationId)

  return data
})