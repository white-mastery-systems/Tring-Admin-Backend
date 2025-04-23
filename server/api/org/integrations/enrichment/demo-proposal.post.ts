import { logger } from "~/server/logger";
import { getAllScheduledEventInvitees, getAllCalendlyScheduledEvents, getParsedPhoneNumber } from "~/server/utils/calently/module";
import { getBotUserByOnlyPhone } from "~/server/utils/db/bot-user";
import { getEnrichByEmailOrPhone, updateWhatsappEnrichStatusById } from "~/server/utils/db/whatsapp-enrichment";

export default defineEventHandler(async (event) => {
  try {
    const {name, email, countrycode, phone, link} = await readBody(event)
    const userDetails = await getEnrichByEmailOrPhone(email, phone);
    const message = `Hi *${name}*\n\nThank you for connecting with YourStore.io! \n\n We're thrilled about the possibility of partnering with Tulsisilks to enhance your online operations. We've prepared a comprehensive proposal tailored to your needs:\n    ${link} \n\nFeel free to review it at your convenience. If you have any questions or would like to discuss the details further, we're just a message away!\nLooking forward to your thoughts.\n\nBest regards,\nThe YourStore.io Team`;
    if(!userDetails){
      const botUser = await getBotUserByOnlyPhone(phone)
      if(!botUser) {
        return { status: false, message: "Invalid Bot User in tring"}
      }
      const [integrationData] = await getOrgWhatsappIntegration(botUser.organizationId)
      if(!integrationData){ 
        return { status: false, message: "Whatsapp Integration data not found" }
      }
      const enrichData = await fetchEnrichByPhoneOrCreate(botUser, integrationData.id)
      logger.info(`Whatsapp enrich data: ${JSON.stringify(userDetails)}`);
      const userPhone =`${botUser.countryCode}${botUser.mobile}`.replace("+", "");
      const metadata = integrationData?.metadata;
      await Promise.all([
        // @ts-ignore
        sendWhatsappMessage(metadata?.access_token, metadata?.pid, userPhone, message),
        updateWhatsappEnrichStatusById(enrichData.id, "meeting_link_sent", { ...(enrichData.metadata || {}), link_sent: true}),
      ]);
      return enrichData
    }

    logger.info(`Whatsapp enrichment data: ${JSON.stringify(userDetails)}`)
    const userPhone =`${userDetails.botUser.countryCode}${userDetails.botUser.mobile}`.replace("+", "");
    const metadata = userDetails.integration.metadata;
    await Promise.all([
      // @ts-ignore
      sendWhatsappMessage(metadata?.access_token, metadata?.pid, userPhone, message),
      updateWhatsappEnrichStatusById(userDetails.id, "meeting_link_sent", { ...(userDetails.metadata || {}), link_sent: true}),
    ]);
    return userDetails
  } catch (error:any) {
    return true
  }
})