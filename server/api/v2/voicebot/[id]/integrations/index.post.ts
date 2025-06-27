import { createVoiceBotIntegration } from "~/server/utils/db/voicebots";
import { inArray } from "drizzle-orm";
import { errorResponse } from "~/server/response/error.response";

const db = useDrizzle()

export const zodInsertVoiceBotIntegration = z.object({
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

  const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodInsertVoiceBotIntegration)

   // Step 1: Normalize input integration IDs
   const allIntegrationIds = [
    ...(body?.whatsappIntegrationIds || []),
    ...(body?.integrationId ? [body.integrationId] : [])
  ];

  // Step 2: Find already integrated ones
  const existingIntegrations = await db.query.voicebotIntegrationSchema.findMany({
    where: and(
      eq(voicebotIntegrationSchema.botId, voicebotId),
      inArray(voicebotIntegrationSchema.integrationId, allIntegrationIds)
    )
  });

  const alreadyIntegratedIds = existingIntegrations.map(i => i.integrationId);

  // Step 3: Validate which exist in the integration table
  const allIntegrationRecords = await db.query.integrationSchema.findMany({
    where: inArray(integrationSchema.id, allIntegrationIds)
  });

  const validIntegrationIds = allIntegrationRecords.map(i => i.id);

  // Step 4: Final IDs to insert = valid AND not already integrated
  const newIntegrationIds = validIntegrationIds.filter(id => !alreadyIntegratedIds.includes(id));

  // Step 5: Skip if nothing to add
  if (newIntegrationIds.length === 0) {
    return errorResponse(event, 400, "Integration ids are either already added or invalid.")
  }

  delete body?.whatsappIntegrationIds

  const integrationsToCreate = newIntegrationIds.map((integrationId: string) => ({
    integrationId,
    botId: voicebotId,
    organizationId,
    metadata: {
      ...body,
      integrationId
    }
  }));

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
  
  const voiceBotIntegration = await createVoiceBotIntegration(integrationsToCreate)
  
  return isValidReturnType(event, voiceBotIntegration);
})