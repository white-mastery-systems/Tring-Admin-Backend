import { getTimeLineByIntent } from "~/server/utils/db/timeline";

const zodQueryValidation = z.object({
  q: z.string().optional()
});

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const { chatId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("chatId")
  )
  const query = await isValidQueryHandler(event, zodQueryValidation)
  const data = await getTimeLineByIntent(chatId, query, timeZone);
  return data;
});
