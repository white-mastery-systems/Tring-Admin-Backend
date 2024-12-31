import { logger } from "~/server/logger";
import momentTz from "moment-timezone"
import schedule from "node-schedule"

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

    // logger.info(`whatsapp-response-${data}`);
    //
    return data;
  } catch (err: any) {
    console.log(err);
    logger.error(
      `https://graph.facebook.com/v21.0/${phoneId}/messages----${JSON.stringify(err)} ${JSON.stringify(err.data)}`,
    );
  }
};

export const scheduleEvent = async (
  date: any,
  time: any,
  contactList: any, 
  campaignInformation: any,
  templateInformation: any,
  timeZone: string
) => {
  try {
    const phoneId = templateInformation?.integration?.metadata?.pid;
    const metaToken = templateInformation?.integration?.metadata?.access_token;
    const templateName = templateInformation?.name;
    // const organization = "South India Shelters";
    // const salesmanager = "Reena";
    const language = "en_US";
    const assigned_date = momentTz(date);

    const istMoment = momentTz.tz(time, "HH:mm", timeZone);
    const utcMoment = istMoment.clone().utc(); // Convert to UTC

    const year = assigned_date.get("year");
    const month = assigned_date.get("month")
    const day = assigned_date.get("date");
    const hours = utcMoment.get("hour")
    const minutes = utcMoment.get("minute")

    console.log({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" });
     
    const event = schedule.scheduleJob({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" }, () => {
      console.log("inside scheduling...")
      contactList.forEach(async ({ contacts: contact }: { contacts: any }) => {
        
        const phoneNumber = `${contact.countryCode}${contact.phone}`.replace("+", "");
  
        logger.info(`templateInformation: ${JSON.stringify(templateInformation)}`);

        let components: any[] = [];

        if (templateInformation?.metadata?.templateVariables?.length > 0) {
          let parameters: any = [];
          templateInformation?.metadata?.templateVariables?.map(
            (variable: string) => {
              console.log({ variable });
              if (variable === "firstName") {
                parameters.push({ type: "text", text: contact.firstName });
              } else if (variable === "lastName") {
                parameters.push({ type: "text", text: contact.lastName });
              } else if (variable === "fullName") {
                parameters.push({
                  type: "text",
                  text: `${contact.firstName} ${contact.lastName}`,
                });
              } else if (variable === "mobile") {
                parameters.push({ type: "text", text: phoneNumber });
              }
            },
          );
          components.push({
            type: "BODY",
            parameters,
          });
        }
        if (templateInformation?.metadata?.headerTextTemplateVariables?.length > 0) {
          let parameters: any = [];
          templateInformation?.metadata?.headerTextTemplateVariables?.map(
            (variable: string) => {
              if (variable === "firstName") {
                parameters.push({ type: "text", text: contact.firstName });
              } else if (variable === "lastName") {
                parameters.push({ type: "text", text: contact.lastName });
              } else if (variable === "fullName") {
                parameters.push({
                  type: "text",
                  text: `${contact.firstName} ${contact.lastName}`,
                });
              } else if (variable === "mobile") {
                parameters.push({ type: "text", text: phoneNumber });
              }
            },
          );
          components.push({
            type: "`HEADER`",
            parameters,
          });
        } 
        else if (templateInformation?.metadata?.header !== "text") {
          components.push({
            type: "header",
            parameters: [
              {
                type: templateInformation?.metadata?.header,
                image: {
                  link: `${conf.adminBaseUrl}${templateInformation?.metadata?.headerFile?.url}`,
                },
              },
            ],
          });
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
        logger.info(`whatsapp ${JSON.stringify(data)}`);
      });
     })
    if (!event) {
      logger.error(`whatsapp campaign event not scheduled`)
      return false
    }
    logger.info(`whatsapp campaign event not scheduled`)
    return { status: true };
  } catch (error: any) {
    logger.error(`Whatsapp scheduleEvent error: ${JSON.stringify(error.message)}`);
    return { status: false };
  }
};

// const event = schedule.scheduleJob(
    //   { year, month, date: day, hour: hours, minute: minutes, tz: "UTC" },
    //   () => {
    //     logger.info({ level: "info", message: "Message sending..." });
    //     contactList.forEach(async (item: any) => {
    //
    //       const phoneNumber = `${item.countryCode}${item.phone}`.replace(
    //         "+",
    //         "",
    //       );
    //
    //       const components = {
    //         name: item.firstName,
    //         organization,
    //         project: "Testing",
    //         number: phoneNumber,
    //         manager: salesmanager,
    //         organizationName: organization,
    //       };
    //       const data = await sendWhatsappTemplateMessage(
    //         metaToken,
    //         phoneId,
    //         phoneNumber,
    //         templateName,
    //         components,
    //         language,
    //       );
    //
    //     });
    //   },
    // );
    //
    // if (!event) {
    //   return { status: false };
    // }