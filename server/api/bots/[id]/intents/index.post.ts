import { createBotIntent } from "~/server/utils/db/bot";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const body = await readBody(event).catch(() => {});

  const bot = await createBotIntent({
    ...body,
    organizationId,
  });
  return bot;

  //   console.log(query);
  //   return await db.execute(query);
});
