import { logger } from "../logger"
import * as schedule from "node-schedule"
import { getAllSalesHandyvoiceBotIntegrations } from "../utils/db/bot"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("0 11 * * *", async () => {
      logger.info("SalesHandy cron job started")
      const botIntegrationDataList = await getAllSalesHandyvoiceBotIntegrations();
        if (botIntegrationDataList.length){
          await Promise.all(botIntegrationDataList.map(async (botIntegrationData) => {
            const metadata:any = botIntegrationData?.metadata;
            const integrationData = botIntegrationData?.integration;
      
            if (!metadata?.sequenceObj?.id) {
              return { status: true, data: {}, message: "No sequence found" };
            }
      
            const contactList = await getUnRepliedSalesHandyUsersPhones(`${integrationData?.metadata?.apiKey}`, metadata?.sequenceObj?.id, metadata?.sequenceObj?.name);

            if (contactList.length){
              await Promise.all(contactList.map(async (contact) => {
                if(contact.count > 2){
                  // const dialVoiceCall = await $fetch(`${config.public.voiceBotBaseUrl}/dial`, {
                  const dialVoiceCall = await $fetch(`/api/voicebots/${botIntegrationData?.botId}/dial`,{
                      method: "POST",
                      body: {
                        ...contact,
                        id: botIntegrationData?.botId,
                      },
                    },
                  );
                  if(!dialVoiceCall) {
                    logger.error(`Failed to initiate call to the SalesHandy user with unreplied mail: ${contact?.countryCode}${contact?.phone}`);
                  } else{
                    logger.info(`Call successfully initiated to the SalesHandy user with unreplied mail: ${contact?.countryCode}${contact?.phone}`);
                  }
                }
              }))
            }
          }))
        }
    })
  } catch (error: any) {
    logger.error(`SalesHandy cron job error: ${JSON.stringify(error.message)}`)
  }
})