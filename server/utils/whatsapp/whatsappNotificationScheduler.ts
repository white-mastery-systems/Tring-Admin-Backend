import momentTz from "moment-timezone";
import schedule from "node-schedule";
import { logger } from "~/server/logger";

export const sendWhatsAppNotificationScheduler = async (
  dateTime: any,
  metadata: any,
  userPhone:string,
  message: string,
  timeZone?: string,
) => {
  try {
    const phoneId = metadata?.pid;
    const accessToken = metadata?.access_token;
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

    const event = schedule.scheduleJob({ year, month, date: day, hour: hours, minute: minutes, tz: "UTC" }, async () => {
      logger.info("Inside scheduling...");
      await sendWhatsappMessage(accessToken, phoneId, userPhone, message)
    });

    if (!event) {
      logger.error(`whatsapp notification event is not scheduled`);
      return { status: false };
    }
    logger.info(`whatsapp notification event is scheduled`);
    return { status: true };
  } catch (error: any) {
    logger.error(`Whatsapp scheduleEvent error: ${JSON.stringify(error.message)}`);
    return { status: false };
  }
};
