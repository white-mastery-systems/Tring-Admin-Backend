export default defineEventHandler(async (event) => {

  const { id: callLogId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await deleteCallLogById(callLogId)

  return data
})