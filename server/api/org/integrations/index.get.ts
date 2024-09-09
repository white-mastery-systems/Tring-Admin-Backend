import { listIntegrations } from "~/server/utils/db/integrations";

const zodListIntegration = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  // const query = getQuery(event);
  const query = await isValidQueryHandler(event, zodListIntegration)
  return await listIntegrations(organizationId, query);
});
