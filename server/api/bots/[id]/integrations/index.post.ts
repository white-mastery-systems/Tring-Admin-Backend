import { createBotIntegration } from "~/server/utils/db/bot";
import { joinSlackChannel } from "~/server/utils/slack/modules";
export const zodInsertBotIntegration = z.object({
  integrationId: z.string().uuid(),
  campaignId: z.string().optional(),
  projectId: z.string().optional(),
  pipelineId: z.string().optional(),
  pipelineObj: z.any().optional(),
  channelId: z.string().optional(),
  layoutObj: z.any().optional(),
  stage: z.string().optional()
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const body = await isValidBodyHandler(event, zodInsertBotIntegration);
  if (body?.channelId) {
    const integrationData: any = await findIntegrationDetails(
      organizationId,
      body?.integrationId,
    );
    joinSlackChannel({
      token: integrationData?.metadata?.access_token,
      refreshToken: integrationData?.metadata?.refresh_token,
      integrationData: integrationData?.metadata,
      channelId: body?.channelId,
    });
  }
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
