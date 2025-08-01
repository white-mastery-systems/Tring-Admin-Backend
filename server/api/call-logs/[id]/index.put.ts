const zodUpdateCallLogValidator = z.object({
  callSid: z.string().optional(),
  exophone: z.string().optional(),
  from: z.string().optional(),
  date: z.string().optional(),
  callStatus: z.string().optional(),
  duration: z.string().optional(),
  countryCode: z.string().optional(),
  interacted: z.boolean().optional(),
  userLanguage: z.string().optional(),
  direction: z.string().optional(),
  callerName: z.string().optional(),
  callTranscription: z.array(z.any()).optional(),
  inputCredits: z.string().optional(),
  metrics: z.record(z.any()).optional(),
  outputCredits: z.string().optional(),
  summary: z.string().optional()
})

export default defineEventHandler(async (event) => {

  const { id: callLogId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodUpdateCallLogValidator)

  const data = await updateCallLogById(callLogId, body)

  return data
})