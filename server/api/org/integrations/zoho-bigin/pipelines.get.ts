import { findIntegrationDetails } from "~/server/utils/db/integrations";
import { getAllPipelinesFromZohoBigin } from "~/server/utils/zoho/modules";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  // const query = getQuery(event);
  // return await listIntegrations(organizationId);
  const query: any = await getQuery(event);
  const integrationData: any = await findIntegrationDetails(
    organizationId,
    query.id,
  );
  return await getAllPipelinesFromZohoBigin({
    token: integrationData?.metadata?.access_token,
    refreshToken: integrationData?.metadata?.refresh_token,
    integrationData: integrationData,
  });
});
