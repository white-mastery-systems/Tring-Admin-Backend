import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createChatbotScheduledCall, getChatbotScheduledCallList, updateChatScheduledCall } from "~/server/utils/v2/db/chatScheduledCall"

const config = useRuntimeConfig()

const zodVoiceDialBody = z.object({
  name: z.string(),
  countryCode: z.string(),
  email: z.string(),
  mobile: z.string(),
  voicebotId: z.string(),
  instantCallRequest: z.boolean(),
  scheduledDateTime: z.string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await isValidBodyHandler(event, zodVoiceDialBody)
    const { id: chatbotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    const chatbotDetail: any = await getBotDetails(chatbotId)

    const payload = {
      ...body,
      phone: body?.mobile,
      chatbotId,
      voicebotId: body.voicebotId,
      organizationId: chatbotDetail?.organizationId,
    }

    const alreadyScheduled = await getChatbotScheduledCallList(chatbotDetail?.organizationId, body?.mobile, chatbotId)

    if(alreadyScheduled && body?.scheduledDateTime && !body.instantCallRequest) {
      await updateChatScheduledCall(alreadyScheduled.id, payload)
      return
    } 

    const data = await createChatbotScheduledCall(payload)

    if(body?.instantCallRequest) {
      const voicebotDetail: any = await getVoicebotById(body?.voicebotId!)
      if(!voicebotDetail) {
        logger.error(`chatbot Schedule_call - Voicebot Not found - voicebotId-${body?.voicebotId!}`)
        return
      }

      const dialPayload = {
       name: body?.name,
       phone: body?.mobile,
       countryCode: body?.countryCode,
       botId: body?.voicebotId!,
       exophone: voicebotDetail?.incomingPhoneNumber,
       provider: voicebotDetail?.ivrConfigDetail?.provider,
       cloudTelephonyConfig: voicebotDetail?.ivrConfigDetail?.metadata
      }
      try {
        const dialVoiceCall = await $fetch(`${config.public.voiceBotBaseUrl}/dial`, {
          method: "POST",
          body: dialPayload
        })
        if(dialVoiceCall) {
          logger.info(`Chatbot scheduled-call instantCallRequest initiated successfully. Updating status to "dialed" for ID: ${data.id}`);
          const updatedVoiceCall = await updateChatScheduledCall(data.id, { callSid: dialVoiceCall!, callStatus: "dialed" });
          logger.info(`Chatbot scheduled-call instantCallRequest status updated successfully for ID: ${updatedVoiceCall.id}`);
        }
      } catch(error: any) {
          logger.error(`chat instantCallRequest voice Dial API Error: ${error.message}`)
          await updateChatScheduledCall(data.id, { callStatus: "failed" })
      }
    }
    
    return data
  } catch (error: any) {
    logger.error(`Voicebot Dial API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to dial voice call")
  }
})