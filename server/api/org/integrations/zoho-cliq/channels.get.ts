import { logger } from "~/server/logger";
import { getZohoCliqChannels } from "~/server/utils/zoho/cliq/modules";

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query: any = await getQuery(event);
  const integrationData: any = await findIntegrationDetails(
    organizationId,
    query.id,
  );
  const metadata = integrationData?.metadata

  const data = await getZohoCliqChannels(integrationData?.id, metadata)
  return data

})