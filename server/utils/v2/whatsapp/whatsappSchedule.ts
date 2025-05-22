import momentTz from "moment-timezone";
import schedule from "node-schedule";
import { logger } from "~/server/logger";
import { sendWhatsappCampaignWithTemplate } from "../whatsapp/module";
import { getTemplateDetailsByName } from "../../template";

export const scheduleWhatsAppCampaignV2 = async (
  campaignId: string,
  date: string,
  time: string,
  contactList: any,
  templateName: string,
  integrationData: any,
  timeZone: string,
) => {
  try {

    const assigned_date = momentTz(date).tz(timeZone);
    const localTime = momentTz.tz(time, "HH:mm", timeZone);
    const utcTime = localTime.clone().utc(); // Convert to UTC

    const year = assigned_date.get("year");
    const month = assigned_date.get("month");
    const day = assigned_date.get("date");
    const hours = utcTime.get("hour");
    const minutes = utcTime.get("minute");

    logger.info(`scheduled time: ${JSON.stringify({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" })}`);
    const event = schedule.scheduleJob({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" }, async () => {
      await sendWhatsappCampaignWithTemplate({ templateName, campaignId, metadata:integrationData.metadata, contactList });
    });

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
