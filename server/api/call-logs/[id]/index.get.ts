export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";
  await isOrganizationAdminHandler(event)

  const { id: callLogId } = getRouterParams(event)
  const query = await isValidQueryHandler(event, z.object({
    callSid: z.string().optional()
  }))

  const data = await getCallLogById(callLogId, timeZone, query)

  return data
})