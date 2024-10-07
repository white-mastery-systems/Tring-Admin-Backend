import { createCallLogs } from "~/server/utils/db/call-logs"

const zodInsertCallLogsValidator = z.object({
  callSid: z.string(),
  exophone: z.string(),
  from: z.string(),
  date: z.string(),
  duration: z.string(),
  direction: z.string(),
  callerName: z.string(),
  callTranscription: z.string(),
  inputCredits: z.string(),
  outputCredits: z.string(),
  organizationId: z.string(),
  botId: z.string(),
})

export default defineEventHandler(async (event) => {

  const body = await isValidBodyHandler(event, zodInsertCallLogsValidator)

  const data = await createCallLogs({
    ...body,
  })

  return isValidReturnType(event, data)
})