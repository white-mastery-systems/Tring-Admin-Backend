import { logger } from "../logger"
import { getNotDialedChatScheduledCalls, updateChatScheduledCall } from "./v2/db/chatScheduledCall"
import momentTz from "moment-timezone"

const config = useRuntimeConfig()

export const chatbotScheduleCall = async () => {
  try {
    const chatNotDialedScheduledCallList = await getNotDialedChatScheduledCalls()
    if(!chatNotDialedScheduledCallList.length) {
      logger.error("No Chatbot scheduled calls to dial")
      return
    }

    for(const scheduledCall of chatNotDialedScheduledCallList) {
      const voicebotDetail: any = await getVoicebotById(scheduledCall?.voicebotId!)
      if(!voicebotDetail) {
        logger.error(`chatbot Schedule_call - Voicebot Not found - voicebotId-${scheduledCall?.voicebotId!}`)
        return
      }
      const orgZohoSubscription = await getOrgZohoSubscription(scheduledCall?.organizationId!, "voice")
      if(orgZohoSubscription?.subscriptionStatus !== "active") {
        logger.error(`chatbot Schedule_call - Zoho subscription plan is not active - organizationId -${scheduledCall?.organizationId!}`)
        return 
      }

      const currentDateTime = momentTz().utc()
      const scheduledDateTime = momentTz(scheduledCall?.scheduledDateTime).utc()
      
      const differenceInMinutes = Math.abs(currentDateTime.diff(scheduledDateTime, "minutes"));

      if(differenceInMinutes <= 5) {
        const dialPayload = {
          name: scheduledCall?.name,
          phone: scheduledCall?.phone,
          countryCode: scheduledCall?.countryCode,
          botId: scheduledCall?.voicebotId!,
          exophone: voicebotDetail?.incomingPhoneNumber,
          provider: voicebotDetail?.ivrConfigDetail?.provider,
          cloudTelephonyConfig: voicebotDetail?.ivrConfigDetail?.metadata
        }
        try{
          const dialVoiceCall = await $fetch(`${config.public.voiceBotBaseUrl}/dial`, {
            method: "POST",
            body: dialPayload
          })
          if(dialVoiceCall) {
            logger.info(`Chatbot scheduled-call initiated successfully. Updating status to "dialed" for ID: ${scheduledCall.id}`);
            const updatedVoiceCall = await updateChatScheduledCall(scheduledCall.id, { callSid: dialVoiceCall!, callStatus: "dialed" });
            logger.info(`Chatbot scheduled-call status updated successfully for ID: ${updatedVoiceCall.id}`);
          }
        } catch(error: any) {
            logger.error(`voice Dial API Error: ${error.message}`)
            await updateChatScheduledCall(scheduledCall.id, { callStatus: "failed" })
        }
      }
    }
  } catch (error: any) {
    logger.error(`chatbotScheduleCall Error: ${JSON.stringify(error.message)}`)
  }
}