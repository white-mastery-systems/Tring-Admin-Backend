import { logger } from "~/server/logger"
import { getAllVoiceNewCampaigns } from "~/server/utils/v2/db/campaign"
import { getAllContactProfiles } from "~/server/utils/v2/db/contacts"
import { getNotDialedCallListByCampaignId, updateVoiceScheduledCall } from "~/server/utils/v2/db/voicebot"
import momentTz from "moment-timezone"

const config = useRuntimeConfig()

export const voicebotCallSchedular = async () => {
  try {
    const [activeVoicebots, exophoneList, campaignList, voiceContactList, orgVoiceSubscription] = await Promise.all([
      getAllActiveVoicebots(),
      getAllExoPhones(),
      getAllVoiceNewCampaigns(),
      getAllContactProfiles(),
      getAllOrgVoiceZohoSubscription()
    ])

    // Create an array of promises for concurrent processing
  await Promise.all(
    campaignList.map(async (campaign: any) => {
      const botInfo: any = activeVoicebots.find((bot) =>  bot.id === campaign.botConfig.botId)
      const timeZone = botInfo?.botDetails?.timezone || "Asia/Kolkata"

      let startHour: number, startMinute: number, endHour: number, endMinute: number;
      const currentDate = momentTz().tz(timeZone).startOf("day")

      if(!campaign.instantAction) {
        const campaignDate = momentTz(campaign?.botConfig?.date).tz(timeZone).startOf("day");
        if (campaignDate.isAfter(currentDate)) {
          logger.error(`Campaign scheduling skipped: Scheduled date is future date: (${campaignDate.format("YYYY-MM-DD")}), Current date: ${currentDate.format("YYYY-MM-DD")}`);
          return;
        }
        [startHour, startMinute] = campaign?.botConfig?.workingStartTime.split(":").map(Number);
        [endHour, endMinute] = campaign?.botConfig?.workingEndTime.split(":").map(Number);
      }
     
      const ivrConfig = exophoneList.find((exophone) => exophone.id === botInfo?.ivrConfig)

      const noOfCallsPerTrigger = getCallTriggerCountForVoiceProviders(ivrConfig?.provider!) || 1

      const notDialedScheduledVoiceCallList = await getNotDialedCallListByCampaignId(campaign?.id)

      const voiceScheduleContactList = notDialedScheduledVoiceCallList.slice(0, noOfCallsPerTrigger)
      if(!voiceScheduleContactList.length) {
        logger.error("No call list available to dial call")
        return
      }
  
      for (const schedular of voiceScheduleContactList) {
          const voiceContactInfo = voiceContactList.find((contact) => contact.id === schedular.contactId)
          const currentTime = momentTz().tz(timeZone);
          if(!campaign.instantAction) {
            const workingStartTime = momentTz().tz(timeZone).hour(startHour).minute(startMinute).second(0)
            const workingEndTime = momentTz().tz(timeZone).hour(endHour).minute(endMinute).second(0)
        
            if(!currentTime.isBetween(workingStartTime, workingEndTime)) {
              logger.error(`The current time is outside of working hours - Date: ${campaign?.botConfig?.date} workingStartTime: ${workingStartTime}, WorkingEndTime: ${workingEndTime}, currentTime: ${currentTime}`)
              return 
            }
          }
    
          const orgSubscription = orgVoiceSubscription.find((subscription: any) => subscription.organizationId === campaign.organizationId)   
          if(orgSubscription?.subscriptionStatus !== "active") {
            logger.error(`Organization voice subscription plan status is not active- ${campaign.organizationId}`)
            return 
          }
  
          const payload = {
            ...schedular,
            ...voiceContactInfo,
            phone: voiceContactInfo?.phoneNumber,
            exophone: botInfo?.incomingPhoneNumber,
            provider: ivrConfig?.provider,
            cloudTelephonyConfig: ivrConfig?.metadata
          }
          const { createdAt, updatedAt, ...data } = payload
          try {
            const dialVoiceCall: any = await $fetch(`${config.public.voiceBotBaseUrl}/dial`, {
              method: "POST",
              body: data
            })
            if(dialVoiceCall) {
              logger.info(`Call initiated successfully. Updating status to "dialed" for ID: ${schedular.id}`);
              const updatedVoiceCall = await updateVoiceScheduledCall(schedular.id, { callSid: dialVoiceCall, callStatus: "Booked" });
              logger.info(`Call status updated successfully for ID: ${updatedVoiceCall.id}`);
            }
          } catch (error: any) {
            logger.error(`voice Dial API Error: ${error.message}`)
            await updateVoiceScheduledCall(schedular.id, { callStatus: "Failed", maxRetryCount: (schedular.maxRetryCount || 0) + 1 })
          }    
       }
    })
  )
} catch (error: any) {
    logger.error(`voicebot - Dialer schedular Error:,${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}


const getCallTriggerCountForVoiceProviders = (provider: string) => {
  let callPerTrigger = 1
  switch(provider) {
    case "plivo":
      callPerTrigger = 5
      break
    case "telnyx":
      callPerTrigger = 2
      break
  }
  return callPerTrigger
}