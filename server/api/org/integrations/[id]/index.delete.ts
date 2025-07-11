import { errorResponse } from "~/server/response/error.response";
import { getChatVoiceIntegrationByIntegrationId } from "~/server/utils/db/integrations";

export const zodDeleteSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const params = await isValidRouteParamHandler(event, zodDeleteSchema);

  const query = await isValidQueryHandler(event, z.object({
    confirmDelete: z.string().default("false"),
  }))

  const botIntegration = await getChatVoiceIntegrationByIntegrationId(params.id)

  if(botIntegration && query.confirmDelete === "false") {
    return errorResponse(event, 400, "Integration is linked to a bot. Please confirm deletion to proceed");
  }

  const integration = await deleteIntegration(params.id);
  return integration;
});
