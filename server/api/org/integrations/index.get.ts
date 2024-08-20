import { listIntegrations } from "~/server/utils/db/integrations";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = getQuery(event);
  return await listIntegrations(organizationId);
});
