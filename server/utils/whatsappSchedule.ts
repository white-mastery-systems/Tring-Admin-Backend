import { logger } from "~/server/logger";
import momentTz from "moment-timezone"
import schedule from "node-schedule"
import { getTemplateDetailsByName } from "./template";

const conf = useRuntimeConfig();

const sendWhatsappTemplateMessage = async (
  metaToken: string,
  phoneId: string,
  userPhone: string,
  templateName: string,
  components: Record<string, any>,
  language?: string,
) => {
  try {
    logger.info(
      `meta-whatsapp-${`https://graph.facebook.com/v21.0/${phoneId}/messages`}---->${JSON.stringify(
        {
          ignoreResponseError: true,
          method: "post",
          headers: {
            Authorization: `Bearer ${metaToken}`,
          },
          body: {
            messaging_product: "whatsapp",
            to: userPhone,
            type: "template",
            template: {
              name: templateName,
              language: {
                code: language ?? "en_US",
              },
              components,
            },
          },
        },
      )}`,
    );
    const data = await $fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${metaToken}`,
        },
        body: {
          messaging_product: "whatsapp",
          to: userPhone,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: language ?? "en",
            },
            components,
          },
        },
      },
    );
    return data;
  } catch (err: any) {
    console.log(err);
    logger.error(
      `https://graph.facebook.com/v21.0/${phoneId}/messages---->Error: ${JSON.stringify(err.data)}`,
    );
  }
};

export const scheduleEvent = async (
  date: any,
  time: any,
  contactList: any, 
  templateName: any,
  integrationData: any,
  timeZone: string
) => {
  try {
    const phoneId = integrationData?.metadata?.pid
    const metaToken = integrationData?.metadata?.access_token
    const wabaId = integrationData.metadata?.wabaId
    
    const assigned_date = momentTz(date)
    const localTime = momentTz.tz(time, "HH:mm", timeZone)
    const utcTime = localTime.clone().utc(); // Convert to UTC

    const year = assigned_date.get("year")
    const month = assigned_date.get("month")
    const day = assigned_date.get("date")
    const hours = utcTime.get("hour")
    const minutes = utcTime.get("minute")

    console.log({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" })

    const event = schedule.scheduleJob({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" }, () => {
      console.log("inside scheduling...")
      contactList.forEach(async ({ contacts: contact }: { contacts: any }) => {
        
        const phoneNumber = `${contact.countryCode}${contact.phone}`.replace("+", "");

        let components: any[] = [];
        let language = "en_US";

        const templateDetailList = await getTemplateDetailsByName(wabaId, metaToken, templateName)
        const templateByName = templateDetailList?.data?.find((i: any) => i.name === templateName)
        if(templateByName) {
          // components = templateByName.components
          language = templateByName.language
        }

        const data = await sendWhatsappTemplateMessage(
          metaToken,
          phoneId,
          phoneNumber,
          templateName,
          components,
          language,
        );
        //TODO remove once it is done
        logger.info(`whatsapp response: ${JSON.stringify(data)}`);
      });
     })
    console.log({ event })
    if (!event) {
      logger.error(`whatsapp campaign event is not scheduled`)
      return { status: false }
    }
    logger.info(`whatsapp campaign event is scheduled`)
    return { status: true }
  } catch (error: any) {
    logger.error(`Whatsapp scheduleEvent error: ${JSON.stringify(error.message)}`)
    return { status: false }
  }
};
