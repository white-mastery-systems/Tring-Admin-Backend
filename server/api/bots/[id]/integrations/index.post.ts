import { createBotIntegration } from "~/server/utils/db/bot";
export const zodInsertBotIntegration = z.object({
  integrationId: z.string().uuid(),
  campaignId: z.string().optional(),
  projectId: z.string().optional(),
  pipelineId: z.string().optional(),
  pipelineObj: z.any().optional(),
  layoutObj:z.any().optional()
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const body = await isValidBodyHandler(event, zodInsertBotIntegration);
  const bot = await createBotIntegration({
    integrationId: body.integrationId,
    botId,
    organizationId,
    metadata: {
      ...body,
    },
  });

  return bot;
});
