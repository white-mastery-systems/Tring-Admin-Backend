import { createCallLogs } from "~/server/utils/db/call-logs"
import { updateSubscriptionPlanUsageById } from "~/server/utils/v2/db/planUsage"

const zodInsertCallLogsValidator = z.object({
  callSid: z.string(),
  exophone: z.string(),
  from: z.string(),
  date: z.string(),
  callStatus: z.string().optional(),
  duration: z.string(),
  direction: z.string(),
  callerName: z.string(),
  callTranscription: z.array(z.any()),
  inputCredits: z.string(),
  outputCredits: z.string(),
  metrics: z.record(z.any()).optional(),
  organizationId: z.string(),
  botId: z.string(),
  summary: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, zodInsertCallLogsValidator)

  const data = await createCallLogs({
    ...body,
  })

  const voicePlanUsage = await getOrgPlanUsage(body?.organizationId, "voice")
  
  const roundedDuration = Math.round(Number(body?.duration) / 60) * 60;
  const durationInMinutes = roundedDuration / 60;
  
  const totalMinutes = (voicePlanUsage?.interactionsUsed || 0) + durationInMinutes

  await updateSubscriptionPlanUsageById(voicePlanUsage?.id!, { interactionsUsed: totalMinutes })

  return isValidReturnType(event, data)
})