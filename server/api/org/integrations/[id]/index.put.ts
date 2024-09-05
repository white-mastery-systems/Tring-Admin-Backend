const zodupdateIntegration = z.object({
  name: z.string().optional(),
  crm: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: integrationId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body = await isValidBodyHandler(event, zodupdateIntegration);

  const updateIntegration = await updateIntegrationById(integrationId, body);
  return isValidReturnType(event, updateIntegration);
});
