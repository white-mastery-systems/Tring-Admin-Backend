import { inArray } from "drizzle-orm";
import { errorResponse } from "~/server/response/error.response";
import { createBotIntegration } from "~/server/utils/db/bot";
import { joinSlackChannel } from "~/server/utils/slack/modules";

const db = useDrizzle()

export const zodInsertBotIntegration = z.object({
  integrationId: z.string().uuid().optional(),
  campaignId: z.string().optional(),
  projectId: z.string().optional(),
  pipelineId: z.string().optional(),
  pipelineObj: z.any().optional(),
  channelId: z.string().optional(),
  layoutObj: z.any().optional(),
  sequenceObj: z.any().optional(),
  stage: z.string().optional(),
  restaurantId: z.string().optional(),
  departments: z.array(z.any()).optional(),
  whatsappIntegrationIds: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id")
  );
  const body = await isValidBodyHandler(event, zodInsertBotIntegration);

  // ✅ Step 1: Normalize input integration IDs
  const allIntegrationIds = [
    ...(body?.whatsappIntegrationIds || []),
    ...(body?.integrationId ? [body.integrationId] : [])
  ];

  // ✅ Step 2: Find already integrated ones
  const existingIntegrations = await db.query.botIntegrationSchema.findMany({
    where: and(
      eq(botIntegrationSchema.botId, botId),
      inArray(botIntegrationSchema.integrationId, allIntegrationIds)
    )
  });
  const alreadyIntegratedIds = existingIntegrations.map(i => i.integrationId);

  // return alreadyIntegratedIds

  // ✅ Step 3: Validate which exist in the integration table
  const allIntegrationRecords = await db.query.integrationSchema.findMany({
    where: inArray(integrationSchema.id, allIntegrationIds)
  });
  const validIntegrationIds = allIntegrationRecords.map(i => i.id);

  // ✅ Step 4: Final IDs to insert = valid AND not already integrated
  const newIntegrationIds = validIntegrationIds.filter(id => !alreadyIntegratedIds.includes(id));

  // ✅ Step 5: Skip if nothing to add
  if (newIntegrationIds.length === 0) {
    return errorResponse(event, 400, "Integration ids are either already added or invalid.")
  }
  
  delete body?.whatsappIntegrationIds
  // ✅ Step 6: Prepare records to insert
  const integrationsToCreate = newIntegrationIds.map((integrationId: string) => ({
    integrationId,
    botId,
    organizationId,
    metadata: {
      ...body,
      integrationId
    }
  }));

  // ✅ Step 7: (Optional) join Slack if needed
  for (const id of newIntegrationIds) {
    const integration = allIntegrationRecords.find(i => i.id === id);
    if (body?.channelId && integration?.crm === "slack") {
      joinSlackChannel({
        token: integration?.metadata?.access_token,
        refreshToken: integration?.metadata?.refresh_token,
        integrationData: integration?.metadata,
        channelId: body.channelId,
        integrationId: id,
      });
    }
  }

  // ✅ Step 8: Create new bot integrations
  const bot = await createBotIntegration(integrationsToCreate);
  return bot;
});

