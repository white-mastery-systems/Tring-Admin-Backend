export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await deleteCampaign(campaignId)

  return data
})