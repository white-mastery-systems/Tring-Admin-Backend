import { logger } from "~/server/logger";
import momentTz from "moment-timezone";
import schedule from "node-schedule";
import {
  getTemplateDetailsByName,
  sendWhatsappTemplateMessage,
} from "./template";
import { fetchFileFromUrl } from "./whatsappMedia";
import { updateWhatsappMessageStatus } from "./db/campaign";

export const scheduleWhatsAppCampaign = async (
  campaignId: string,
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

    logger.info(`scheduled time: ${ 
      JSON.stringify({
        year,
        month,
        date: day,
        hour: hours,
        minute: minutes,
        tz: "UTC",
      })}`
    );

    let templateComponents: any[] = [];
    let templateLanguageCode = "en";

    const templateDetailList = await getTemplateDetailsByName(
      wabaId,
      accessToken,
      templateName,
    );
    const templateInformation = templateDetailList?.find(
      (i: any) => i.name === templateName,
    );

    templateInformation.components.forEach(async(component: any) => {
        if (
          component.type === 'HEADER' &&
          component.format === 'IMAGE'
        ) {
          const image = await fetchFileFromUrl(
            component.example.header_handle[0],
            templateName
          );
          const imageMedia = await uploadMedia(phoneId, accessToken, image, `${image.type}`);
          let parameters: any = [];
          parameters.push({
            type: 'image',
            image: {
              id: imageMedia.id,
            },
          });
          templateComponents.push({
            type: component.type,
            parameters,
          });
        } else if (
          component.type === 'HEADER' &&
          component.format === 'DOCUMENT'
        ) {
          const document = await fetchFileFromUrl(
            component.example.header_handle[0],
            templateName,
          );
          const docMedia = await uploadMedia(
            phoneId,
            accessToken,
            document,
            `${document.type}`,
          );
          let parameters: any = [];
          parameters.push({
            type: 'document',
            document: {
              id: docMedia.id,
            },
          });
          templateComponents.push({
            type: component.type,
            parameters,
          });
        }
    });

    const event = schedule.scheduleJob(
      { year, month, date: day, hour: hours, minute: minutes, tz: "UTC" },
      () => {
        logger.info("Inside scheduling...");
        contactList.forEach(
          async ({ contacts: contact }: { contacts: any }) => {
            const phoneNumber =
              `${contact.countryCode}${contact.phone}`.replace("+", "");
            
            if (templateInformation) {
              templateLanguageCode = templateInformation.language;
              templateInformation.components.forEach((component: any) => {
               if (
                  component.type === "BODY" &&
                  component.example?.body_text
                ) {
                  let parameters: any = [];
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
              });
            }
            // console.log({ Component: JSON.stringify(templateComponents)})

            const data: any = await sendWhatsappTemplateMessage(
              phoneId,
              accessToken,
              phoneNumber,
              templateName,
              templateComponents,
              templateLanguageCode,
            );
            logger.info(`whatsapp response: ${JSON.stringify(data)}`);
            await updateWhatsappMessageStatus(campaignId, contact.phone, data?.messages[0]?.id, phoneId, "sent")
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
