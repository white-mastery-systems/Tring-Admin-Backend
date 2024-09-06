export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  return await deleteNumberIntegration(numberIntegrationId)
})