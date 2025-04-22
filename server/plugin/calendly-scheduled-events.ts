import { logger } from "../logger"
import * as schedule from "node-schedule"
import { getAllScheduledEventInvitees, getAllCalendlyScheduledEvents, getParsedPhoneNumber } from "~/server/utils/calently/module";
import { getEnrichByEmailOrPhone, updateWhatsappEnrichStatusById, bookedWhatsappEnrichList } from "~/server/utils/db/whatsapp-enrichment";

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("30 10 * * *", async () => {
      // schedule.scheduleJob("*/1 * * * *", async () => {
      logger.info("Calendly scheduled event cron job started");

      /* After POC will make it dynamically
            const botIntegrationDataList = await getAllSalesHandyvoiceBotIntegrations();
            if (botIntegrationDataList.length){
                await Promise.all(botIntegrationDataList.map(async (botIntegrationData:any) => {
                    const metadata:any = botIntegrationData?.metadata;
                    const integrationData = botIntegrationData?.integration;
            
                    if (metadata?.calendlyObj?.access_token) {
                    // inside the make it all operations
                    }
                }))
            }
        */

      // All Operations
      const scheduledEvents = await getAllCalendlyScheduledEvents(undefined, undefined, "active");
      if (scheduledEvents.length) {
        await Promise.all(scheduledEvents.map(async (schEvents: any) => {
          const inviteeList = await getAllScheduledEventInvitees(null, schEvents?.uri);
          if (inviteeList.length) {
            await Promise.all(inviteeList.map(async (invitee: any) => {
              const inviteeId = invitee?.uri.split("/invitees/")[1];
              const inviteeDetails = invitee;
              if (inviteeDetails && inviteeDetails?.email && inviteeDetails?.questions_and_answers[0]?.answer) {
                const { phone } = getParsedPhoneNumber(inviteeDetails?.questions_and_answers[0]?.answer);
                const userDetails = await getEnrichByEmailOrPhone(inviteeDetails?.email, phone);
                if (userDetails && !["meeting_booked", "completed"].includes(userDetails.status)) {
                  const enrichStatus = (userDetails.status === "meeting_cancelled") ? "meeting_rescheduled" : "meeting_booked";

                  if (userDetails.metadata && !userDetails.metadata?.bookedMessage) {
                    const userPhone =`${userDetails.botUser.countryCode}${userDetails.botUser.mobile}`.replace("+", "");
                    const metadata = userDetails.integration.metadata;
                    const message = `Your meeting slot is confirmed \n\nClick meeting link below: \nLink: ${schEvents?.location?.join_url}`;
                    await Promise.all([
                      // @ts-ignore
                      sendWhatsappMessage(metadata?.access_token, metadata?.pid, userPhone, message),
                      updateWhatsappEnrichStatusById(userDetails.id, enrichStatus, { ...(userDetails.metadata || {}), inviteeId, bookedMessage: true, link: schEvents?.location?.join_url}),
                    ]);
                  } else {
                    await updateWhatsappEnrichStatusById(userDetails.id, enrichStatus, {...(userDetails.metadata || {}), inviteeId, bookedMessage: true, link: schEvents?.location?.join_url});
                  }
                }

                const startTimeUTC = new Date(schEvents?.start_time); // 6:30 PM IST
                const now = new Date(); // current time in IST system time
                const isPassed = now > startTimeUTC;

                if (userDetails && ["meeting_booked", "meeting_rescheduled"].includes(userDetails.status) && isPassed) {
                  updateWhatsappEnrichStatusById(userDetails.id, "completed", {...(userDetails.metadata || {}), inviteeId, bookedMessage: true });
                }
              }
            }));
          }
        }));
      }
    });

    // schedule.scheduleJob("*/11 * * * *", async () => {
    schedule.scheduleJob("0 11 */2 * *", async () => {
      logger.info("Calendly scheduled event cron job started");

      const bookedEnrichList = await bookedWhatsappEnrichList();
      if (bookedEnrichList.length) {
        await Promise.all(
          bookedEnrichList.map(async (userDetails: any) => {
            if (userDetails && ["meeting_booked", "meeting_rescheduled"].includes(userDetails.status)) {
              const userPhone =`${userDetails.botUser.countryCode}${userDetails.botUser.mobile}`.replace("+", "");
              const metadata = userDetails.integration.metadata;
              const message = (userDetails.metadata?.link)? `Your meeting slot is confirmed \n\nClick meeting link below: \nLink: ${userDetails.metadata?.link}`:"Reminder you have meeting";

              await sendWhatsappMessage(metadata?.access_token, metadata?.pid, userPhone, message);
            }
          }),
        );
      }
    });
  } catch (error: any) {
    logger.error(`Calendly scheduled events cron job error: ${JSON.stringify(error.message)}`)
  }
})