import { getIvrIntegrationByName, isIvrIntegrationNameAlreadyExistsForUpdate } from "~/server/utils/db/number-integration"

const db = useDrizzle()

const zodUpdateNumberIntegration = z.object({
  ivrIntegrationName: z.string().optional(),
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

  const body: any = await isValidBodyHandler(event, zodUpdateNumberIntegration)

  const isAlreadyExists = await isIvrIntegrationNameAlreadyExistsForUpdate(numberIntegrationId, body?.ivrIntegrationName!, organizationId)
  if (isAlreadyExists) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Ivr-integration Name Already Exists",
      }),
    );
  }
  
  const update = await updateNumberIntegration(numberIntegrationId, body)

  return update
})