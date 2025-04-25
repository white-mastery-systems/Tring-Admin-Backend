import { logger } from "~/server/logger"
import { insertCallLogsInClay } from "~/server/utils/clay/webhook"
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
  // demo
  if(body?.botId === "5261422b-57cb-432a-bf9f-904eca5d3cf0") {
    try {
      insertCallLogsInClay({ body: data })
    } catch (error: any) {
      logger.error(`Insert call-logs in Clay Error: ${JSON.stringify(error.message)}`)
    }
  }
  
  const organizationId = body?.organizationId

  const [voicePlan, voicePlanUsage, orgDetail, adminDetail ] = await Promise.all([
    getOrgZohoSubscription(organizationId, "voice"),
    getOrgPlanUsage(organizationId, "voice"),
    getOrganizationById(organizationId),
    getAdminByOrgId(organizationId)
  ]) 
  
  
  const roundedDuration = Math.ceil(Number(body?.duration) / 60) * 60;
  const durationInMinutes = roundedDuration / 60;

  const adminCountry = adminDetail?.address?.country

  let planPricingDetail
  if(
    voicePlan?.subscriptionStatus === "trial" || 
    voicePlan?.pricingPlanCode === "voice_free" || voicePlanUsage?.originalSubscriptionStatus === "trial"
  ) {
    planPricingDetail = await getPricingInformation("voice_free")
  } else {
    planPricingDetail = await getSubcriptionPlanDetailByPlanCode(voicePlan?.pricingPlanCode!, adminCountry)
  }
  
  const totalMinutes = (voicePlanUsage?.interactionsUsed || 0) + durationInMinutes
  const maxCallMinutes = planPricingDetail?.sessions || 0
  const wallet = orgDetail?.wallet || 0
  
  if(totalMinutes >= maxCallMinutes) {
    if(wallet <=0) {
      await updateOrgZohoSubscription(organizationId, "voice", { subscriptionStatus: "inactive" })
    }
  }

  await updateSubscriptionPlanUsageById(voicePlanUsage?.id!, { interactionsUsed: totalMinutes })

  return isValidReturnType(event, data)
})