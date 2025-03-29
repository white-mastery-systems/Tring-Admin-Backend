import { logger } from "../logger"
import * as schedule from "node-schedule"
import { fetchOrCreateSalesHandyContact, getAllSalesHandyvoiceBotIntegrations, updateSalesHandyContact } from "../utils/db/voicebots"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("0 11 * * *", async () => {
      logger.info("SalesHandy cron job started")
      const botIntegrationDataList = await getAllSalesHandyvoiceBotIntegrations();
        if (botIntegrationDataList.length){
          await Promise.all(botIntegrationDataList.map(async (botIntegrationData) => {
            const metadata:any = botIntegrationData?.metadata;
            const integrationData = botIntegrationData?.integration;
      
            if (metadata?.sequenceObj?.id) {
              const contactList = await getUnRepliedSalesHandyUsersPhones(`${integrationData?.metadata?.apiKey}`, metadata?.sequenceObj?.id, metadata?.sequenceObj?.name);
  
              if (contactList.length){
                await Promise.all(contactList.map(async (contact) => {
                  if(contact.count){
                    // @ts-ignore
                    const salesHandyContact = await fetchOrCreateSalesHandyContact(botIntegrationData?.botId, botIntegrationData.id, metadata?.sequenceObj?.id, contact.phone, contact.email)

                    if (salesHandyContact.callStatus === "not dialed") {
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
                        await updateSalesHandyContact(salesHandyContact.id, {...contact, ...salesHandyContact, callStatus:"dialed"})
                        logger.info(`Call successfully initiated to the SalesHandy user with unreplied mail: ${contact?.countryCode}${contact?.phone}`);
                      }
                    }
                  }
                }))
              }
            }
          }))
        }
    })
  } catch (error: any) {
    logger.error(`SalesHandy cron job error: ${JSON.stringify(error.message)}`)
  }
})