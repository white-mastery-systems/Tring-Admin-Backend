import { getIntegrationById } from "~/server/utils/db/integrations";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const { id: integrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const getOrgIntegration = await getIntegrationById(organizationId, integrationId)

  return getOrgIntegration;
})