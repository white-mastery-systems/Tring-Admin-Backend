export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
  const query = await isValidQueryHandler(event, z.object({
    q: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    period: z.string().optional()
  }))

  const data = await scheduledCampaignCallList(organizationId, campaignId, timeZone, query)

  return data  
})