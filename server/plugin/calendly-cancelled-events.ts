import { logger } from "../logger"
import * as schedule from "node-schedule"
import { getAllScheduledEventInvitees, getAllCalendlyScheduledEvents, getParsedPhoneNumber } from "~/server/utils/calently/module";
import { getEnrichByEmailOrPhone, updateWhatsappEnrichStatusById } from "~/server/utils/db/whatsapp-enrichment";

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("0 10 * * *", async () => {
    // schedule.scheduleJob("*/2 * * * *", async () => {
      logger.info("Calendly cancelled event cron job started");

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
        const scheduledEvents = await getAllCalendlyScheduledEvents(undefined, undefined, "canceled");
        if (scheduledEvents.length) {
            await Promise.all(scheduledEvents.map(async(schEvents:any)=>{
                const inviteeList = await getAllScheduledEventInvitees(null, schEvents?.uri);
                if (inviteeList.length) {
                    await Promise.all(inviteeList.map(async(invitee:any)=>{
                        const inviteeId = invitee?.uri.split("/invitees/")[1];
                        const inviteeDetails = invitee;
                        if (inviteeDetails && inviteeDetails?.email) {
                            let enrichUser = await getEnrichByEmailOrPhone(inviteeDetails?.email)
                            if (inviteeDetails?.questions_and_answers[0]?.answer) {
                            const { phone } = getParsedPhoneNumber(inviteeDetails?.questions_and_answers[0]?.answer);
                            enrichUser = await getEnrichByEmailOrPhone(inviteeDetails?.email, phone);
                            }
                            const userDetails = enrichUser;
                            if (userDetails && !["meeting_cancelled", "meeting_rescheduled"].includes(userDetails.status)) {
                                const userPhone = `${userDetails.botUser.countryCode}${userDetails.botUser.mobile}`.replace("+", "")
                                const metadata = userDetails.integration.metadata; const message = `Your meeting slot is cancelled`;
                                
                                // @ts-ignore
                                if(userDetails.metadata && !userDetails.metadata?.cancelMessage){
                                    await Promise.all([
                                        // @ts-ignore
                                        sendWhatsappMessage(metadata?.access_token, metadata?.pid, userPhone, message),
                                        updateWhatsappEnrichStatusById(userDetails.id, "meeting_cancelled", {...(userDetails.metadata || {}), inviteeId, cancelMessage:true})
                                    ])
                                } else {
                                    await updateWhatsappEnrichStatusById(userDetails.id, "meeting_cancelled", {...(userDetails.metadata || {}), inviteeId, cancelMessage:true})
                                }  
                            }
                        }
                    }))
                }
            }))
        }
    })
  } catch (error: any) {
    logger.error(`Calendly scheduled events cron job error: ${JSON.stringify(error.message)}`)
  }
})