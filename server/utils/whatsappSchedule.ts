import { logger } from "~/server/logger";
import momentTz from "moment-timezone";
import schedule from "node-schedule";
import {
  getTemplateDetailsByName,
  sendWhatsappTemplateMessage,
} from "./template";

const conf = useRuntimeConfig();

// const sendWhatsappTemplateMessage = async (
//   metaToken: string,
//   phoneId: string,
//   userPhone: string,
//   templateName: string,
//   components: Record<string, any>,
//   language?: string,
// ) => {
//   try {
//     logger.info(
//       `meta-whatsapp-${`https://graph.facebook.com/v21.0/${phoneId}/messages`}---->${JSON.stringify(
//         {
//           ignoreResponseError: true,
//           method: "post",
//           headers: {
//             Authorization: `Bearer ${metaToken}`,
//           },
//           body: {
//             messaging_product: "whatsapp",
//             to: userPhone,
//             type: "template",
//             template: {
//               name: templateName,
//               language: {
//                 code: language ?? "en_US",
//               },
//               components,
//             },
//           },
//         },
//       )}`,
//     );
//     const data = await $fetch(
//       `https://graph.facebook.com/v21.0/${phoneId}/messages`,
//       {
//         method: "post",
//         headers: {
//           Authorization: `Bearer ${metaToken}`,
//         },
//         body: {
//           messaging_product: "whatsapp",
//           to: userPhone,
//           type: "template",
//           template: {
//             name: templateName,
//             language: {
//               code: language ?? "en",
//             },
//             components,
//           },
//         },
//       },
//     );
//     return data;
//   } catch (err: any) {
//     console.log(err);
//     logger.error(
//       `https://graph.facebook.com/v21.0/${phoneId}/messages---->Error: ${JSON.stringify(err.data)}`,
//     );
//   }
// };

export const scheduleWhatsAppCampaign = async (
  date: any,
  time: any,
  contactList: any,
  templateName: any,
  integrationData: any,
  timeZone: string,
) => {
  try {
    const phoneId = integrationData?.metadata?.pid;
    const accessToken = integrationData?.metadata?.access_token;
    const wabaId = integrationData.metadata?.wabaId;

    const assigned_date = momentTz(date);
    const localTime = momentTz.tz(time, "HH:mm", timeZone);
    const utcTime = localTime.clone().utc(); // Convert to UTC

    const year = assigned_date.get("year");
    const month = assigned_date.get("month");
    const day = assigned_date.get("date");
    const hours = utcTime.get("hour");
    const minutes = utcTime.get("minute");

    logger.debug(
      JSON.stringify({
        year,
        month,
        date: day,
        hour: hours,
        minute: minutes,
        tz: "UTC",
      }),
    );

    const event = schedule.scheduleJob(
      { year, month, date: day, hour: hours, minute: minutes, tz: "UTC" },
      () => {
        logger.info("inside scheduling...");
        contactList.forEach(
          async ({ contacts: contact }: { contacts: any }) => {
            const phoneNumber =
              `${contact.countryCode}${contact.phone}`.replace("+", "");

            let templateComponents: any[] = [];
            let templateLanguageCode = "en";

            const templateDetailList = await getTemplateDetailsByName(
              wabaId,
              accessToken,
              templateName,
            );
            const templateInformation = templateDetailList?.data?.find(
              (i: any) => i.name === templateName,
            );
            if (templateInformation) {
              templateLanguageCode = templateInformation.language;
              templateInformation.components.forEach(
                (component: any) => {
                  let parameters: any = [];
                  if (
                    component.type === "BODY" &&
                    component.example?.body_text
                  ) {
                    component.example.body_text[0].map((variable: string) => {
                      if (variable === "firstName") {
                        parameters.push({
                          type: "text",
                          text: contact.firstName,
                        });
                      } else if (variable === "lastName") {
                        parameters.push({
                          type: "text",
                          text: contact.lastName,
                        });
                      } else if (variable === "fullName") {
                        parameters.push({
                          type: "text",
                          text: `${contact.firstName} ${contact.lastName}`,
                        });
                      } else if (variable === "mobile") {
                        parameters.push({ type: "text", text: phoneNumber });
                      }
                    });
                    templateComponents.push({
                      type: component.type,
                      parameters,
                    });
                  }
                },
              );
            }

            const data = await sendWhatsappTemplateMessage(
              phoneId,
              accessToken,
              phoneNumber,
              templateName,
              templateComponents,
              templateLanguageCode,
            );
            logger.info(`whatsapp response: ${JSON.stringify(data)}`);
          },
        );
      },
    );

    logger.info({ event });
    if (!event) {
      logger.error(`whatsapp campaign event is not scheduled`);
      return { status: false };
    }
    logger.info(`whatsapp campaign event is scheduled`);
    return { status: true };
  } catch (error: any) {
    logger.error(
      `Whatsapp scheduleEvent error: ${JSON.stringify(error.message)}`,
    );
    return { status: false };
  }
};
