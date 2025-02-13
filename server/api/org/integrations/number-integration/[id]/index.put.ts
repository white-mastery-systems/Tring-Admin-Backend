const db = useDrizzle()

const zodUpdateNumberIntegration = z.object({
  provider: z.string().optional(),
  metadata: z.object({
   authId: z.string().optional(),
   accountSid: z.string().optional(),
   apiSecret: z.string().optional(),
   authToken: z.string().optional(),
   subDomain: z.string().optional(),
   apiKey: z.string().optional(),
   apiToken: z.string().optional(),
   flowId: z.string().optional(),
   publicKey: z.string().optional(),
   connectionId: z.string().optional()
  }).optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event)

  const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodUpdateNumberIntegration)

  const isAlreadyExists = await db.query.numberIntegrationSchema.findFirst({
    where: and(
      eq(numberIntegrationSchema.organizationId, organizationId),
      eq(numberIntegrationSchema.provider, body?.provider),
      ne(numberIntegrationSchema.id, numberIntegrationId)
    )
  })

  if (isAlreadyExists) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Provider Already Exists: The specified provider is already registered. Please use a different provider or check for duplicates.",
      }),
    );
  }

  const update = await updateNumberIntegration(numberIntegrationId, body)

  return update
})