import { errorResponse } from "~/server/response/error.response";
import { checkIntegrationNameAlreadyExists } from "~/server/utils/db/integrations";

const zodupdateIntegration = z.object({
  name: z.string().optional(),
  crm: z.string().optional(),
  type: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event);
  const { id: integrationId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body = await isValidBodyHandler(event, zodupdateIntegration);

  if(body?.name) {
    const exists = await checkIntegrationNameAlreadyExists(organizationId, body?.name, "update", integrationId)
    if (exists) {
      return errorResponse(event, 400, "Integration name already exists",)
    } 
  }

  const updateIntegration = await updateIntegrationById(integrationId, body);
  return isValidReturnType(event, updateIntegration);
});
