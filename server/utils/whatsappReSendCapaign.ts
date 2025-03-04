import { logger } from "~/server/logger";
import { getTemplateDetailsByName, sendWhatsappTemplateMessage } from "./template";
import { fetchFileFromUrl } from "./whatsappMedia";
import { updateWhatsappMessageStatus } from "./db/campaign";
import { uploadMedia } from "./whatsappMedia";

export const whatsappReSendCampaign = async (campaignId: string, templateName: any, contactList: any, metadata: any ) => {
  try {
    let templateLanguageCode = "en";
    const phoneId = metadata?.pid;
    const accessToken = metadata?.access_token;
    const wabaId = metadata?.wabaId;

    const templateDetailList = await getTemplateDetailsByName(wabaId, accessToken, templateName);
    const templateInformation = templateDetailList?.find((i: any) => i.name === templateName);

    const headerParameter: any = [];
    const headerComponent: any = [];
    const headerTasks = templateInformation.components
      .filter((component: any) => component.type === "HEADER" && ["IMAGE", "DOCUMENT"].includes(component.format))
      .map(async (component: any) => {
        try {
          const media = await fetchFileFromUrl(component.example.header_handle[0], templateName);
          const uploadedMedia = await uploadMedia(phoneId, accessToken, media, media.type);

          headerParameter.push({
            type: component.format.toLowerCase(),
            [component.format.toLowerCase()]: { id: uploadedMedia.id },
          });
        } catch (error: any) {
          logger.error(`Error processing media for ${templateName}:`, error);
        }
      });

    await Promise.all(headerTasks);
    if (headerParameter.length) {
      headerComponent.push({ type: "header", parameters: headerParameter});
    }

    contactList.forEach(async ({ contacts: contact }: { contacts: any }) => {
      const bodyComponents:any = [];
      const bodyParameters:any = [];
      const phoneNumber =`${contact?.countryCode}${contact?.phone}`.replace("+", "");
      
      if (templateInformation) {
        templateLanguageCode = templateInformation.language;
        templateInformation.components.forEach((component: any) => {
          if (component.type === "BODY" && component.example?.body_text) {
            component.example.body_text[0].map((variable: string) => {
              if (variable === "firstName" && contact?.firstName) {
                bodyParameters.push({ type: "text", text: contact?.firstName })
              } else if (variable === "lastName" && contact?.lastName) {
                bodyParameters.push({ type: "text", text: contact?.lastName })
              } else if (variable === "fullName" ) {
                bodyParameters.push({ type: "text", text: `${contact?.firstName} ${contact?.lastName}`, })
              } else if (variable === "email" ) {
                bodyParameters.push({ type: "text", text: contact?.email })
              } else if (variable === "mobile" && contact?.phone) {
                bodyParameters.push({ type: "text", text: `+${contact?.countryCode} ${contact?.phone}` })
              }
            });
          } else if (component.type === "BODY" && component.text && component.text.match(/{{\d+}}/g)) {
            if(component.includes("{{1}}") && contact?.firstName) {
              bodyParameters.push({ type: "text", text: contact?.firstName })
            }
            if(component.includes("{{2}}") && contact?.lastName) {
              bodyParameters.push({ type: "text", text: contact?.lastName });
            }
            if(component.includes("{{3}}") && contact?.email) {
              bodyParameters.push({ type: "text", text: contact?.email });
            }
            if(component.includes("{{4}}") && contact?.phone) {
              bodyParameters.push({ type: "text", text: `+${contact?.countryCode} ${contact?.phone}` });
            }
          }
        });
      }
      
      if(bodyParameters.length) {
        bodyComponents.push({ type: "body", parameters: bodyParameters });
      }

      const data: any = await sendWhatsappTemplateMessage(
        phoneId,
        accessToken,
        phoneNumber,
        templateName,
        [...headerComponent, ...bodyComponents],
        templateLanguageCode,
      );
      logger.info(`whatsapp response: ${JSON.stringify(data)}`);
      if(data?.messages[0]?.id) {
        await updateWhatsappMessageStatus(campaignId, contact?.phone, data?.messages[0]?.id, phoneId, "sent")
      }
    });

    return { status: true };
  } catch (error: any) {
    logger.error(`Whatsapp Resend Campaign Event error: ${JSON.stringify(error.message)}`);
    return { status: false };
  }
};
