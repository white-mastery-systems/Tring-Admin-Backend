import { findIntegrationDetails } from "~/server/utils/db/integrations";
import { regenearateTokenWithRefreshToken } from "~/server/utils/zoho/auth";
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
  try {
    const data = await getAllPipelinesFromZohoBigin({
      token: integrationData?.metadata?.access_token,
    });
    console.log({ data });
    return data;
  } catch (err: any) {
    if (err.status === 401) {
      return regenearateTokenWithRefreshToken({
        refreshToken: integrationData?.metadata?.refresh_token,
      })
        .then(async (data: any) => {
          const result = await getAllPipelinesFromZohoBigin({
            token: data.access_token,
          });
          
          updateIntegrationById(integrationData.id, {
            ...integrationData.metadata,
            access_token: data.access_token,
          });
          return result;
        })
        .catch((err) => {
          console.log("SENCONDDD", err.data);
        });
    }
  }
});
