import { createBotIntegration } from "~/server/utils/db/bot";
export const zodInsertBotIntegration = z.object({
  integration: z.string().min(1),
  campaignId: z.string().min(1),
  projectId: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const body = await isValidBodyHandler(event, zodInsertBotIntegration);
  const bot = await createBotIntegration({
    integration: body.integration,
    botId,
    organizationId,
    metadata: {
      ...body,
    },
  });

  return bot;
});
