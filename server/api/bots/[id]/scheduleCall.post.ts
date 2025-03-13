import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createChatbotScheduledCall } from "~/server/utils/v2/db/chatScheduledCall"

const zodVoiceDialBody = z.object({
  name: z.string(),
  countryCode: z.string(),
  email: z.string(),
  mobile: z.string(),
  voicebotId: z.string(),
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

    const data = await createChatbotScheduledCall({
      ...body,
      phone: body?.mobile,
      chatbotId,
      voicebotId: body.voicebotId,
      organizationId: chatbotDetail?.organizationId,
    })
    
    return data
  } catch (error: any) {
    console.log({ error })
    logger.error(`Voicebot Dial API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to dial voice call")
  }
})