import { logger } from "~/server/logger"
import momentTz from "moment-timezone"
import { getAllFailedCallList } from "~/server/utils/v2/db/voicebot"

const config = useRuntimeConfig()

export const voicebotRetryScheduler = async () => {
  try {
    const [activeVoicebots, exophoneList, failedCalls, voiceContactList, orgVoiceSubscription] = await Promise.all([
      getAllActiveVoicebots(),
      getAllExoPhones(),
      getAllFailedCallList(), // should return all failed calls with campaignId, retryAttempts, etc.
      getAllContactProfiles(),
      getAllOrgVoiceZohoSubscription()
    ]);

   for (const schedular of failedCalls) {
      const campaign: any = await getNewCampaignById(schedular.campaignId);
      if (!campaign || !campaign.retryAttempt) continue;

      const { duration, frequencyPerDay, timeSlots } = campaign.retryAttempt;
      if (!duration || !frequencyPerDay || !timeSlots?.length) continue;

      const botInfo = activeVoicebots.find((bot: any) => bot.id === campaign.botConfig?.botId);
      const timeZone = botInfo?.botDetails?.timezone || "Asia/Kolkata";

      const currentTime = momentTz().tz(timeZone); // use bot/campaign-specific timezone if needed
      const today = currentTime.format("YYYY-MM-DD");

      const totalAttempts = schedular.retryAttemptTimestamps?.length || 0;
      const totalAllowed = duration * frequencyPerDay;
      
      const firstFailureTime = schedular.retryAttemptTimestamps?.[0]?.timestamp || schedular.updatedAt;
      
      const hasRetryWindowExpired = currentTime.diff(momentTz(firstFailureTime), "days") >= duration;
      
      if (hasRetryWindowExpired || totalAttempts >= totalAllowed) {
        await updateVoiceScheduledCall(schedular?.id, { isRetryExpired: true })
        logger.info(`Retry window expired for schedularId: ${schedular.id}`);
        continue;
      }

      const WINDOW_MINUTES = 5;
      const currentMinutes = currentTime.hours() * 60 + currentTime.minutes();

      const matchedSlot = timeSlots.find((slot: string) => {
        const [hh, mm] = slot.split(":").map(Number);
        const slotMinutes = hh * 60 + mm;
        return Math.abs(currentMinutes - slotMinutes) <= WINDOW_MINUTES;
      });

      if (!matchedSlot) {
        logger.info(`Current time not in retry time slots. Skipping schedularId: ${schedular.id}`);
        continue;
      }

      logger.info(`Retry time slot matched: ${matchedSlot}, schedularId: ${schedular.id}`)

      // Check retry frequency for today
      const attemptsToday = (schedular.retryAttemptTimestamps || []).filter(
        (attempt: any) =>
          momentTz(attempt.timestamp).tz(timeZone).format("YYYY-MM-DD") === today
      );

      if (attemptsToday.length >= frequencyPerDay) {
        logger.info(`Retry limit reached for today on schedularId: ${schedular.id}`);
        continue;
      }

      const contactInfo = voiceContactList.find(c => c.id === schedular.contactId);
      const orgSubscription = orgVoiceSubscription.find(sub => sub.organizationId === campaign.organizationId);
      if (orgSubscription?.subscriptionStatus !== "active") continue;

      const ivrConfig = exophoneList.find(exo => exo.id === botInfo?.ivrConfig);
      const payload = {
        ...schedular,
        ...contactInfo,
        phone: contactInfo?.phoneNumber,
        exophone: botInfo?.incomingPhoneNumber,
        provider: ivrConfig?.provider,
        cloudTelephonyConfig: ivrConfig?.metadata
      };

      try {
        const dialVoiceCall: any = await $fetch(`${config.public.voiceBotBaseUrl}/dial`, {
          method: "POST",
          body: payload
        });

        logger.info(`Retry call successful for schedular ID: ${schedular.id}`);
        await updateVoiceScheduledCall(schedular.id, {
          callSid: dialVoiceCall,
          callStatus: "Ongoing",
          retryAttemptTimestamps: [...(schedular.retryAttemptTimestamps || []), { timestamp: currentTime.toISOString() }]
        });

      } catch (error: any) {
        logger.error(`Retry failed for schedular ID: ${schedular.id} - ${error.message}`);
        await updateVoiceScheduledCall(schedular.id, {
          callStatus: "Failed",
          maxRetryCount: (schedular.maxRetryCount || 0) + 1,
          retryAttemptTimestamps: [...(schedular.retryAttemptTimestamps || []), { timestamp: currentTime.toISOString() }]
        });
      }
    }
  } catch (error: any) {
    logger.error(`Retry voice-call scheduler encountered an error: ${error.message}`);
    throw new Error(error)
  }
};


