export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";

  const { id: callLogId } = getRouterParams(event)
  const query = await isValidQueryHandler(event, z.object({
    callSid: z.string().optional()
  }))

  const data = await getCallLogById(callLogId, timeZone, query)

  return isValidReturnType(event, data)
})