export const zodDeleteSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const params = await isValidRouteParamHandler(event, zodDeleteSchema);

  const integration = await deleteIntegration(params.id);
  return integration;
});
