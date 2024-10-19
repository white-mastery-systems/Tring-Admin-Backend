const zodUpdateCallLogValidator = z.object({
  callSid: z.string().optional(),
  exophone: z.string().optional(),
  from: z.string().optional(),
  date: z.string().optional(),
  duration: z.string().optional(),
  direction: z.string().optional(),
  callerName: z.string().optional(),
  callTranscription: z.array(z.any()).optional(),
  inputCredits: z.string().optional(),
  outputCredits: z.string().optional(),
  summary: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: callLogId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodUpdateCallLogValidator)

  const data = await updateCallLogById(callLogId, body)

  return data
})