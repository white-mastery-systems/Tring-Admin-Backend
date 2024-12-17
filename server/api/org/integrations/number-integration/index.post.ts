import { createNumberIntegration, getExophoneByProvider } from "~/server/utils/db/number-integration"

const zodInsertNumberIntegration = z.object({
   provider: z.string(),
   metadata: z.object({
     accountSid: z.string().optional(),
     authToken: z.string().optional(),
     apiSecret: z.string().optional(),
     subDomain: z.string().optional(),
     apiKey: z.string().optional(),
     apiToken: z.string().optional(),
     flowId: z.string().optional(),
     publicKey: z.string().optional(),
     connectionId: z.string().optional()
  })
})

export default defineEventHandler(async (event) => {
   const organizationId = (await isOrganizationAdminHandler(event)) as string
  
   const body = await isValidBodyHandler(event, zodInsertNumberIntegration)

   const isAlreadyExists = await getExophoneByProvider(body.provider, organizationId)

   if(isAlreadyExists) {
      return sendError(
         event,
         createError({
            statusCode: 400,
            statusMessage: "Provider is already exists",
         }),
      );
   }
  
   const creation = await createNumberIntegration({
      ...body,
      organizationId
   })
   return isValidReturnType(event, creation)
})