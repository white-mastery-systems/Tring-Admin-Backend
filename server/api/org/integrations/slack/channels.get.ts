import { findIntegrationDetails } from "~/server/utils/db/integrations";
import { getAllChannelsFromSlack } from "~/server/utils/slack/modules";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  // const query = getQuery(event);
  // return await listIntegrations(organizationId);
  const query: any = await getQuery(event);
  const integrationData: any = await findIntegrationDetails(
    organizationId,
    query.id,
  );

  const data = await getAllChannelsFromSlack(integrationData.metadata, integrationData?.id);

  return data;
});
