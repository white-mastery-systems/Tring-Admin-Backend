import { listBotIntegrations } from "~/server/utils/db/bot";

const zodQueryValidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const query = await isValidQueryHandler(event, zodQueryValidator)

  return await listBotIntegrations(botId, query);
});
