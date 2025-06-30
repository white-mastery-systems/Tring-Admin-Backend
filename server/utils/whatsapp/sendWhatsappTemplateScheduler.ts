import momentTz from "moment-timezone";
import schedule from "node-schedule";
import { logger } from "~/server/logger";
import { getTemplateBodyVariables, getTemplateHeaderVariables, variablePrameterObj } from "../whatsapp/module";
import { getTemplateDetailsByName, sendWhatsappTemplateMessage } from "../template";
import { fetchFileFromUrl } from "./whatsappMedia";

export const sendWhatsAppTemplateScheduler = async (
  dateTime: any,
  contactList: any,
  templateName: any,
  integrationData: any,
  timeZone?: string,
) => {
  try {
    const phoneId = integrationData?.metadata?.pid;
    const accessToken = integrationData?.metadata?.access_token;
    const wabaId = integrationData.metadata?.wabaId;

    const timezone = (timeZone) ?? momentTz.tz.guess();
    const scheduledMoment = momentTz.utc(dateTime).tz(timezone);
    const assigned_date = scheduledMoment.clone();
    const time = scheduledMoment.format("HH:mm");
    const localTime = momentTz.tz(time, "HH:mm", timezone);
    const utcTime = localTime.clone().utc(); // Convert to UTC

    const year = assigned_date.get("year");
    const month = assigned_date.get("month");
    const day = assigned_date.get("date");
    const hours = utcTime.get("hour");
    const minutes = utcTime.get("minute");

    logger.info(`Send Whatsapp Template scheduled time: ${JSON.stringify({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC"})}`);
    let templateLanguageCode = "en";

    const templateDetailList = await getTemplateDetailsByName(wabaId, accessToken, templateName);
    const templateInformation = templateDetailList?.find((i: any) => i.name === templateName);
    const isPositional = templateInformation?.parameter_format === "POSITIONAL";

    const headerMediaParameter: any = [];
    const headerMediaComponent: any = [];
    const headerTasks = templateInformation.components
      .filter((component: any) => component.type === "HEADER" && ["IMAGE", "DOCUMENT"].includes(component.format))
      .map(async (component: any) => {
        try {
          const media = await fetchFileFromUrl(component.example.header_handle[0], templateName);
          const uploadedMedia = await uploadMedia(phoneId, accessToken, media, media.type);
          const format = component.format?.toLowerCase();
          headerMediaParameter.push({ type: format, [format]: { id: uploadedMedia.id }});
        } catch (error: any) {
          logger.error("Error processing media:", error.message);
        }
      });

    await Promise.all(headerTasks);
    if (headerMediaParameter.length) {
      headerMediaComponent.push({ type: "header", parameters: headerMediaParameter });
    }

    const event = schedule.scheduleJob({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" },() => {
      logger.info("Inside scheduling...");
      contactList.forEach(async ({ contacts: contact }: { contacts: any }) => {
        const headerComponent: any = [];
        const headerParameter: any = [];
        const bodyComponents: any = [];
        const bodyParameters: any = [];
        const buttonsComponents: any = [];
        const phoneNumber = `${contact.countryCode}${contact.phone}`.replace("+", "");

        if (templateInformation) {
          templateLanguageCode = templateInformation.language;
          templateInformation.components.forEach((component: any) => {
            if (component.type === "HEADER" && component.example && !["IMAGE", "DOCUMENT"].includes(component.format)) {
              const headerVariables = getTemplateHeaderVariables(component.example);
              headerVariables.map((variable: string) => {
                let obj: any = {};
                if (!isPositional) {
                  obj.parameter_name = variable;
                }
                headerParameter.push({
                  ...obj,
                  ...variablePrameterObj(variable, contact),
                });
              });
            }
            if (component.type === "BODY" && component.example) {
              const bodyVariables = getTemplateBodyVariables(component.example);
              bodyVariables.map((variable: any) => {
                let obj: any = {};
                if (!isPositional) {
                  obj.parameter_name = variable;
                }
                bodyParameters.push({
                  ...obj,
                  ...variablePrameterObj(variable, contact),
                });
              });
            } else if (component.type === "BODY" && component.text && component.text?.match(/{{\d+}}/g)) {
              if (component.text?.includes("{{1}}") && contact.firstName) {
                bodyParameters.push({ type: "text", text: contact.firstName });
              }
              if (component.text?.includes("{{2}}") && contact.lastName) {
                bodyParameters.push({ type: "text", text: contact.lastName });
              }
              if (component.text?.includes("{{3}}") && contact.email) {
                bodyParameters.push({ type: "text", text: contact.email });
              }
              if (component.text?.includes("{{4}}") && contact.phone) {
                bodyParameters.push({ type: "text", text: `+${phoneNumber}`, });
              }
            }

            if (component.type === "BUTTONS") {
              component.buttons.forEach((button: any, index: number) => {
                const buttonInd = `${index ?? 0}`;
                if (button.type === "FLOW") {
                  const { flow_id, flow_action, navigate_screen } = button;
                  buttonsComponents.push({
                    type: "button",
                    sub_type: "flow",
                    index: buttonInd,
                    parameters: [{
                        type: "action",
                        action: {
                          flow_token: "unused",
                          flow_action_data: { flow_id, flow_action, navigate_screen },
                        },
                      }],
                  });
                } else if (button.type === "URL") {
                  const { url, example } = button;

                  if (url.includes("{{1}}") && example && Array.isArray(example) && example.length > 0) {
                    // If URL contains a template variable
                    let parts = url.split("{{1}}");
                    let varName = example[0].split(parts[0])[1] ?? example[0];

                    // Clean up {{ }} if still present
                    if (varName.includes("{{") || varName.includes("}}")) {
                      varName = varName.replace(/{{|}}/g, "");
                    }

                    const buttonsParametersObj = variablePrameterObj(varName, contact);
                    buttonsComponents.push({ type: "button", sub_type: "url", index: buttonInd, parameters: [buttonsParametersObj] });
                  } else {
                    // If URL does NOT contain a template variable
                    buttonsComponents.push({ type: "button", sub_type: "url", index: buttonInd, parameters: [{ type: "text", text: url }] });
                  }
                } else if (button.type == "QUICK_REPLY") {
                  buttonsComponents.push({
                    type: "button",
                    sub_type: "quick_reply",
                    index: buttonInd,
                    parameters: [{ type: "payload", payload: "PAYLOAD" }],
                  });
                } else if (button.type == "COPY_CODE") {
                  buttonsComponents.push({
                    type: "button",
                    sub_type: "COPY_CODE",
                    index: buttonInd,
                    parameters: [{
                      type: "coupon_code",
                      coupon_code: (Array.isArray(button.example)) ? button.example[0] : (button.example) ? button.example : "CODEWELCOME200",
                    }],
                  });
                }
              });
            }
          });
        }

        if (headerParameter.length) {
          headerComponent.push({ type: "header", parameters: headerParameter });
        }
        if (bodyParameters.length) {
          bodyComponents.push({ type: "body", parameters: bodyParameters });
        }

        const data: any = await sendWhatsappTemplateMessage(
          phoneId,
          accessToken,
          phoneNumber,
          templateName,
          [
            ...headerMediaComponent,
            ...headerComponent,
            ...bodyComponents,
            ...buttonsComponents,
          ],
          templateLanguageCode,
        );
        logger.info(`whatsapp response: ${JSON.stringify(data)}`);
      });
    });

    logger.info({ event });
    if (!event) {
      logger.error(`whatsapp campaign event is not scheduled`);
      return { status: false };
    }
    logger.info(`whatsapp campaign event is scheduled`);
    return { status: true };
  } catch (error: any) {
    logger.error(`Whatsapp scheduleEvent error: ${JSON.stringify(error.message)}`);
    return { status: false };
  }
};
