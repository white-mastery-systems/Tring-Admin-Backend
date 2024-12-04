import { getNumberIntegration } from "~/server/utils/db/number-integration"

const zodUpdateNumberIntegration = z.object({
   provider: z.string().optional(),
   exoPhone: z.string().optional(),
   countryCode: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodUpdateNumberIntegration)

  const isAlreadyExists = await getNumberIntegration(body?.exoPhone, numberIntegrationId)

  if(isAlreadyExists) {
    return sendError(
      event,
      createError({
         statusCode: 400,
         statusMessage: "Exophone is already exists",
      }),
    );
  }

  const update = await updateNumberIntegration(numberIntegrationId, body)

  return update
})