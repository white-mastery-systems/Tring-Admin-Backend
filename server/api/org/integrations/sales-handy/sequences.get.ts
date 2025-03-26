import { findIntegrationDetails } from "~/server/utils/db/integrations";
import { getSalesHandySequences } from "~/server/utils/sales-handy/module";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    // const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const query: any = await getQuery(event);

    const integrationData = await findIntegrationDetails("", query.id);

    if(!integrationData?.metadata?.apiKey){
      return {status: true, sequences: []};
    }

    const { status, data } = await getSalesHandySequences(integrationData?.metadata?.apiKey);

    if (!status || !data?.length) {
      return { status: true, sequences: [] };
    }

    return {status: true, sequences: data?.map((sequence:any) => ({id: sequence.id, name: sequence.title, progress: sequence.progress}))};
  } catch (error:any) {
    return errorResponse(event, 500, `Unable to get Sales handy sequences ${error.message}`);
  }
});
