import { logger } from "~/server/logger"
import { getAllActiveVoicebots, getNotDialedVoiceCallList, orgVoicebotSubscription } from "./voicebots"
import { getAllExoPhones } from "./number-integration"
import momentTz from "moment-timezone"
import { getAllVoicebotContacts } from "./contacts"
import { getAllVoiceCampaigns } from "./campaign"
import { getAllOrgVoiceSubscription } from "./organization"

export const voicebotDialer = async () => {
  try {
    const [activeVoicebots, exophoneList, campaignList, voiceContactList, notDialedScheduledVoiceCallList, orgVoiceSubscription] = await Promise.all([
      getAllActiveVoicebots(),
      getAllExoPhones(),
      getAllVoiceCampaigns(),
      getAllVoicebotContacts(),
      getNotDialedVoiceCallList(),
      getAllOrgVoiceSubscription()
    ])

    // Create an array of promises for concurrent processing
    campaignList.map(async (campaign: any) => {
      const noOfCallsPerTrigger = parseInt(campaign?.botConfig?.callsPerTrigger) || 1

      const voiceScheduleContactList = notDialedScheduledVoiceCallList.filter((schedular) => schedular.campaignId === campaign.id).slice(0, noOfCallsPerTrigger)
      if(!voiceScheduleContactList.length) {
        logger.error("No call list available to dial call")
        return
      } 

      const botInfo: any = activeVoicebots.find((bot) =>  bot.id === campaign.botConfig.botId)
      const ivrConfig = exophoneList.find((exophone) => exophone.id === botInfo?.ivrConfig)
      const timeZone = botInfo?.botDetails?.timezone || "Asia/Kolkata"

      const [startHour, startMinute] = campaign?.botConfig?.workingStartTime.split(":").map(Number);
      const [endHour, endMinute] = campaign?.botConfig?.workingEndTime.split(":").map(Number);

      const workingStartTime = momentTz().tz(timeZone).hour(startHour).minute(startMinute).second(0)
      const workingEndTime = momentTz().tz(timeZone).hour(endHour).minute(endMinute).second(0)

      // Process schedular concurrently
        voiceScheduleContactList.map(async (schedular) => {
          const voiceContactInfo = voiceContactList.find((contact) => contact.id === schedular.contactId)
          const currentDateTime = momentTz().tz(timeZone)
  
          if(!currentDateTime.isBetween(workingStartTime, workingEndTime)) {
            logger.error("The current time is outside of working hours.")
            return 
          }
  
          const orgSubscription = orgVoiceSubscription.find((subscription: any) => subscription.organizationId === schedular.organizationId)   
          if(orgSubscription?.status !== "active") {
            logger.error("Organization voice subscription plan status is not active")
            return 
          }

          const payload = {
            ...schedular,
            ...voiceContactInfo,
            exophone: botInfo?.incomingPhoneNumber,
            provider: ivrConfig?.provider,
            cloudTelephonyConfig: ivrConfig?.metadata
          }
          const { createdAt, updatedAt, ...data } = payload
          try {
            const dialVoiceCall = await $fetch(`${process.env.NUXT_PUBLIC_VOICE_BOT_URL}/dial`, {
              method: "POST",
              body: data
            })
            if(dialVoiceCall) {
              await updateVoiceCallStatus(schedular.id, { callSid: dialVoiceCall, callStatus: "dialed" })
            }
          } catch (error: any) {
            logger.error(`voice Dial API Error: ${error.message}`)
           await updateVoiceCallStatus(schedular.id, { callStatus: "failed" })
          }
        }) 
    })
    
  } catch (error: any) {
    logger.error(`voicebot - Dialer schedular Error:,${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}