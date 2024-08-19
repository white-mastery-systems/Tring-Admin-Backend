import { deleteIntegration } from "~/server/utils/db/integrations";

export const zodDeleteSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const body = await isValidRouteParamHandler(event, zodDeleteSchema);
  console.log({ body });
  const integration = await deleteIntegration(body.id);
  return integration;
});
