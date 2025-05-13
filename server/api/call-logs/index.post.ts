import { logger } from "~/server/logger"
import { pushCallLogsToAkkuClay, pushCallLogsToYourstoreClay } from "~/server/utils/clay/webhook"
import { createCallLogs } from "~/server/utils/db/call-logs"
import { updateVoiceScheduledContacts } from "~/server/utils/db/voicebots"
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
  // demo purpose
  const callLogHandlers: Record<string, (args: { body: any }) => void> = {
    "dcdaa79f-e01b-4e30-975e-38ceb34d8db6": pushCallLogsToYourstoreClay,
    "5558c8c9-a3b9-460d-a6e4-81e830df4293": pushCallLogsToAkkuClay,
  };

  const handler = callLogHandlers[body?.botId];

  if (handler) {
    try {
      handler({ body: data });
    } catch (error: any) {
      logger.error(`Push CallLogs to Clay Error (botId: ${body?.botId}): ${JSON.stringify(error.message)}`);
    }
  }

  if(body?.direction === "outbound" && body?.metrics?.callOutcome) {
    await updateVoiceScheduledContacts(body?.callSid, { callStatus: body?.metrics?.callOutcome })
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