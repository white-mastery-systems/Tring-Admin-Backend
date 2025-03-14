import { errorResponse } from "~/server/response/error.response";
import { findIntegrationDetails } from "~/server/utils/db/integrations";
import { newGetAllPipelinesFromZohoBigin } from "~/server/utils/v2/integrations/crm/zoho/zoho-bigin";
import { getAllPipelinesFromZohoBigin } from "~/server/utils/zoho/modules";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;
    // const query = getQuery(event);
    // return await listIntegrations(organizationId);
    const query: any = await getQuery(event);
    const integrationData: any = await findIntegrationDetails(
      organizationId,
      query.id,
    );
    const data = await newGetAllPipelinesFromZohoBigin({
      integrationData: integrationData,
    });

    return data;
  } catch (error) {
    return errorResponse(event, 500, "Unable to get zoho-bigin pipelines")
  }
});
