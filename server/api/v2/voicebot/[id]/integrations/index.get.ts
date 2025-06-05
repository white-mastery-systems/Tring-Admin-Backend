import { listVoiceBotIntegrations } from "~/server/utils/db/voicebots";

const zodQueryValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const organization_id = (await isOrganizationAdminHandler(event)) as string;
  const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  const query = await isValidQueryHandler(event, zodQueryValidator)

  const voiceBotIntegrationList = await listVoiceBotIntegrations(organization_id, voicebotId, query)

  return voiceBotIntegrationList
})