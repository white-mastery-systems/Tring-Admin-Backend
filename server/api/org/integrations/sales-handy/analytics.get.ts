import { logger } from "~/server/logger";
import { getIntegrationByBotIntegrationId } from "~/server/utils/db/bot";
import { getUnRepliedSalesHandyUsersPhones } from "~/server/utils/sales-handy/module";

const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
  try {
    // const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const {id} = await getQuery(event);

    const botIntegrationData = await getIntegrationByBotIntegrationId(`${id}`);

    const metadata:any = botIntegrationData?.metadata;
    const integrationData = botIntegrationData?.integration;

    if (!metadata?.sequenceObj?.id) {
      return { status: true, data: {}, message: "No sequence found" };
    }

    const contactList = await getUnRepliedSalesHandyUsersPhones(`${integrationData?.metadata?.apiKey}`, metadata?.sequenceObj?.id, metadata?.sequenceObj?.name);

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

    return contactList;
  } catch (error:any) {
    return []
  }
});
