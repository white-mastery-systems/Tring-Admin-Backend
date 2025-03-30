import { logger } from "../logger"
import * as schedule from "node-schedule"
import { getNotDialSalesHandyContactList } from "../utils/db/voicebots"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("0 * * * *", async () => {
      logger.info("SalesHandy not dialed cron job started")
      const notDialedSalesHandyContacts = await getNotDialSalesHandyContactList()
      if(notDialedSalesHandyContacts.length){
        const contactList = notDialedSalesHandyContacts.slice(0, 2)
        await Promise.all(contactList.map(async (contact) => {
          const dialVoiceCall = await $fetch(`/api/voicebots/${contact.botId}/dial`,{
              method: "POST",
              body: {
                ...contact,
                id: contact.botId,
              },
            },
          );
          if(!dialVoiceCall) {
            logger.error(`Failed to initiate call to the SalesHandy user with unreplied mail: ${contact?.countryCode}${contact.phone}`);
          } else{
            await updateSalesHandyContact(contact.id, {...contact, ...contact, callStatus:"dialed"})
            logger.info(`Call successfully initiated to the SalesHandy user with unreplied mail: ${contact?.countryCode}${contact.phone}`);
          }
        }))
      }   
    })
  } catch (error: any) {
    logger.error(`SalesHandy cron job error: ${JSON.stringify(error.message)}`)
  }
})