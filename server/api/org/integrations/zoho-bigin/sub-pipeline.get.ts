import { findIntegrationDetails } from "~/server/utils/db/integrations";
import { getAllSubPipelinesFromZohoBigin } from "~/server/utils/zoho/modules";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  // const query = getQuery(event);
  // return await listIntegrations(organizationId);
  const query: any = await getQuery(event);
  const integrationData: any = await findIntegrationDetails(
    organizationId,
    query.id,
  );
  const data = await getAllSubPipelinesFromZohoBigin({
    token: integrationData?.metadata?.access_token,
    refreshToken: integrationData?.metadata?.refresh_token,
    integrationData: integrationData,
  });
  console.log({ data });
  return data;
});
