export default defineEventHandler(async(event) => {
  await isOrganizationAdminHandler(event)

  const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const numberIntegrationDetails = await getNumberIntegrationById(numberIntegrationId)

  return numberIntegrationDetails;
})