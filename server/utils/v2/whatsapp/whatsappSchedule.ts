import momentTz from "moment-timezone";
import schedule from "node-schedule";
import { logger } from "~/server/logger";
import { sendWhatsappCampaignWithTemplate } from "../whatsapp/module";
import { getTemplateDetailsByName } from "../../template";

export const scheduleWhatsAppCampaignV2 = async (
  campaignId: string,
  date: any,
  time: any,
  contactList: any,
  templateName: any,
  integrationData: any,
  timeZone: string,
) => {
  try {
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

    logger.info(`scheduled time: ${JSON.stringify({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" })}`);
    const templateDetailList = await getTemplateDetailsByName(wabaId, accessToken, templateName);
    const templateInformation = templateDetailList?.find((i: any) => i.name === templateName);
    
    const event = schedule.scheduleJob({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" }, async () => {
      await sendWhatsappCampaignWithTemplate({ templateInformation, campaignId, metadata:integrationData.metadata, contactList });
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
