import { getBotDetails } from "~/server/utils/db/bot";
import { isValidQueryHandler } from "~/server/utils/validations";

export default defineEventHandler(async (event) => {
  await isValidQueryHandler(event, checkPayloadId("organization_id"));
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const bot = await getBotDetails(botId);
  return isValidReturnType(event, bot);
});
