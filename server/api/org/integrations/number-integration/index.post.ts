import { createNumberIntegration, getExophoneByProvider, getIvrIntegrationByName } from "~/server/utils/db/number-integration"

const zodInsertNumberIntegration = z.object({
   ivrIntegrationName: z.string(),
   provider: z.string(),
   metadata: z.object({
     authId: z.string().optional(),
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

   const isAlreadyExists = await getIvrIntegrationByName(body.ivrIntegrationName, organizationId)

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
  
   const creation = await createNumberIntegration({
      ...body,
      organizationId
   })
   return isValidReturnType(event, creation)
})