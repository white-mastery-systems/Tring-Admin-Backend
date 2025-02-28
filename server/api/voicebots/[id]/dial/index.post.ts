import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

const zodVoiceDialBody = z.object({
  name: z.string(),
  countryCode: z.string(),
  phone: z.string()
})

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await isValidBodyHandler(event, zodVoiceDialBody)
    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const voicebotDetail: any = await getVoicebotById(voicebotId)

    const dialPayload = {
      ...body,
      botId: voicebotId,
      exophone: voicebotDetail?.incomingPhoneNumber,
      provider: voicebotDetail?.ivrConfigDetail?.provider,
      cloudTelephonyConfig: voicebotDetail?.ivrConfigDetail?.metadata
    }
    const dialVoiceCall = await $fetch(`${config.public.voiceBotBaseUrl}/dial`, {
      method: "POST",
      body: dialPayload
    })

    return dialVoiceCall
  } catch (error: any) {
    logger.error(`Voicebot Dial API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to dial voice call")
  }
})