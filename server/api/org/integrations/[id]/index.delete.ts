import { deleteIntegration } from "~/server/utils/db/integrations";

export const zodDeleteSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const body = await isValidRouteParamHandler(event, zodDeleteSchema);

  const integration = await updateIntegrationById(body.id, { isDeleted: true });
  return integration;
});
