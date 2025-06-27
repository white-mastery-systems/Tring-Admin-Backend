import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

const zodVoiceDialBody = z.object({
  name: z.string().optional(),
  countryCode: z.string(),
  phone: z.string()
})

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await isValidBodyHandler(event, zodVoiceDialBody)
    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const voicebotDetail: any = await getVoicebotById(voicebotId)

    const [ voicePlan, voicePlanUsage ] = await Promise.all([
      getOrgZohoSubscription(voicebotDetail?.organizationId, "voice"),
      getOrgPlanUsage(voicebotDetail?.organizationId, "voice")
    ]) 

    if(voicePlanUsage?.originalSubscriptionStatus === "trial" && voicePlan?.subscriptionStatus === "inactive") {
      return errorResponse(event, 500, "Voice subscription trial ended. Please subscribe to continue voice calls")
    }

    if(!["active", "trial"].includes(voicePlan?.subscriptionStatus)) {
      return errorResponse(event, 500, "Voice Subscription status is inactive. Please subscribe to cotinue voice calls")
    }

    if(!voicebotDetail?.active) {
      return errorResponse(event, 400, "Voicebot is not active, Please activate your voicebot")
    }

    const dialPayload = {
      ...body,
      botId: voicebotId,
      exophone: voicebotDetail?.incomingPhoneNumber,
      provider: voicebotDetail?.ivrConfigDetail?.provider,
      cloudTelephonyConfig: voicebotDetail?.ivrConfigDetail?.metadata
    }

    if(dialPayload.provider === "sandbox") {
      return errorResponse(event, 400, "Voice calls are not supported with the sandbox provider. Please use a live provider to initiate calls.")
    }

    const dialVoiceCall = await $fetch(`${config.public.voiceBotBaseUrl}/dial`, {
      method: "POST",
      body: dialPayload
    })
  
    return { status: dialVoiceCall ? true : false }
    
  } catch (error: any) {
    logger.error(`Voicebot Dial API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to dial voice call")
  }
})