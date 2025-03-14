export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: ttsIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await getTtsIntegrationById(ttsIntegrationId)

  return data
})