import { getIntegrationByBotIntegrationId } from "~/server/utils/db/bot";
import { getSalesHandyAnalytics, getSalesHandyMultipleAnalytics } from "~/server/utils/sales-handy/module";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    // const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const {botId, id} = await getQuery(event);

    const botIntegrationData = await getIntegrationByBotIntegrationId(`${id}`);

    const metadata:any = botIntegrationData?.metadata;
    const integrationData = botIntegrationData?.integration;

    if (!metadata?.sequenceObj?.id) {
      return { status: true, sequences: [] };
    }

    // const { status, data } = await getSalesHandyAnalytics(`${integrationData?.metadata?.apiKey}`, metadata?.sequenceObj?.id);
    const { status, data } = await getSalesHandyMultipleAnalytics(`${integrationData?.metadata?.apiKey}`, [metadata?.sequenceObj?.id]);

    return {status, data};
  } catch (error:any) {
    return errorResponse(event, 500, `Unable to get Sales handy sequences ${error.message}`);
  }
});
