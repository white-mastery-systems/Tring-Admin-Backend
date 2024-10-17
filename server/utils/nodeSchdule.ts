import { logger } from "~/server/logger";
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
      `meta-whatsapp-${`https://graph.facebook.com/v20.0/${phoneId}/messages`}---->${JSON.stringify(
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
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
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
      `https://graph.facebook.com/v20.0/${phoneId}/messages----${JSON.stringify(err)} ${JSON.stringify(err.data)}`,
    );
  }
};

export const scheduleEvent = async (
  date: any,
  time: any,
  contactList: any,
  campaignInformation: any,
  templateInformation: any,
) => {
  try {
    const phoneId = templateInformation?.integration?.metadata?.pid;
    const metaToken = templateInformation?.integration?.metadata?.access_token;
    const templateName = templateInformation?.templates?.name;
    // const organization = "South India Shelters";
    // const salesmanager = "Reena";
    const language = "en";

    const assigned_date = new Date(date);
    const assigned_Time = new Date(time);
    // const assigned_date = new Date();
    // const assigned_Time = new Date();

    const year = assigned_date.getFullYear();
    const month = assigned_date.getUTCMonth();
    const day = assigned_date.getUTCDate();
    const hours = assigned_Time.getUTCHours();
    const minutes = assigned_Time.getUTCMinutes();

    console.log({
      year,
      month,
      date: day,
      hour: hours,
      minute: minutes,
      tz: "UTC",
    });

    contactList.forEach(async (contact: any) => {
      const phoneNumber = `${contact.countryCode}${contact.phone}`.replace(
        "+",
        "",
      );
      console.log("HI", templateInformation, "TEMPLATEVARIABLES");
      // let components = [
      //   {
      //     type: "header",
      //     parameters: [
      //       {
      //         type: "image",
      //         image: {
      //           link: "https://app.tringlabs.ai/uploads/1e66997c-7b9c-4711-8079-eb54a286d745.jpg",
      //         },
      //       },
      //     ],
      //   },
      //   {
      //     type: "body",
      //     parameters: [
      //       {
      //         type: "text",
      //         text: body?.lead?.first_name + " " + body?.lead?.last_name,
      //       },
      //       {
      //         type: "text",
      //         text: "South India Shelters",
      //       },
      //       {
      //         type: "text",
      //         text: body?.payload?.interested_properties_name[0],
      //       },
      //       {
      //         type: "text",
      //         text: "+918848083317",
      //       },
      //       {
      //         type: "text",
      //         text: "Reena",
      //       },
      //       {
      //         type: "text",
      //         text: "South India Shelters",
      //       },
      //     ],
      //   },
      // ];
      let components: any[] = [];
      if (
        templateInformation?.templates?.metadata?.templateVariables?.length > 0
      ) {
        let parameters: any = [];
        templateInformation?.templates?.metadata?.templateVariables?.map(
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
      if (
        templateInformation?.templates?.metadata?.headerTextTemplateVariables
          ?.length > 0
      ) {
        let parameters: any = [];
        templateInformation?.templates?.metadata?.headerTextTemplateVariables?.map(
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
      } else if (templateInformation?.templates?.metadata?.header !== "text") {
        components.push({
          type: "header",
          parameters: [
            {
              type: templateInformation?.templates?.metadata?.header,
              image: {
                link: `${conf.llmCallbackUrl}${templateInformation?.templates?.metadata?.headerFile?.url}`,
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
    return { status: true };
  } catch (error: any) {
    logger.error({ level: "error", message: error.message });
    return { status: false };
  }
};
