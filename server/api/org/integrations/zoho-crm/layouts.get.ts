import { findIntegrationDetails } from "~/server/utils/db/integrations";
import { newGetAllLayoutsFromZohoCRM } from "~/server/utils/v2/integrations/crm/zoho/zoho-crm";
// import { getAllLayoutsFromZohoCRM } from "~/server/utils/zoho/modules";


export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query: any = await getQuery(event);
  const integrationData: any = await findIntegrationDetails(
    organizationId,
    query.id,
  );
  return await newGetAllLayoutsFromZohoCRM({
    integrationData: integrationData,
  });
});
