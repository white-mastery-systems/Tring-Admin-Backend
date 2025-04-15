import { logger } from "~/server/logger";
import { findHubspotEventNames } from "~/server/utils/hubspot/module";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    logger.info(`Hubspot Webhook payload:  ${JSON.stringify(body)}`);
    const eventNames = findHubspotEventNames(body)

    if(eventNames.length){
      console.log(`Event Names: ${eventNames}`);
    }

    return { status: true, messsage: "hubspot api success" };
  } catch (error:any) {
    logger.error(`Hubspot Webhook process error:${error.message}`)
    return {status: false, message: error.message}
  }
});
