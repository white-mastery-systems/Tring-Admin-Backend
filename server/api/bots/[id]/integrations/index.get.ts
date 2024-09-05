import { listBotIntegrations } from "~/server/utils/db/bot";

const getChatBotIntents = z.object({
  id: z.string().uuid(),
});
export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const { id: botId } = await isValidRouteParamHandler(
    event,
    getChatBotIntents,
  );

  return await listBotIntegrations(botId);
});
