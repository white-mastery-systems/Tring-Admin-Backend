export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  
  await isOrganizationAdminHandler(event)
  const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
  
  const data = await getCampaignById(campaignId, timeZone)

  return data
})