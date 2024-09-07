const zodUpdateNumberIntegration = z.object({
   provider: z.string().optional(),
   exoPhone: z.string().optional(),
   countryCode: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body: any = await isValidBodyHandler(event, zodUpdateNumberIntegration)

  const update = await updateNumberIntegration(numberIntegrationId, body)

  return update
})