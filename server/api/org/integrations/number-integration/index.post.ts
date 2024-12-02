import { createNumberIntegration, getNumberIntegration } from "~/server/utils/db/number-integration"

const zodInsertNumberIntegration = z.object({
   provider: z.string(),
   exoPhone: z.string(),
   countryCode: z.string()
})

export default defineEventHandler(async (event) => {
   const organizationId = (await isOrganizationAdminHandler(event)) as string
  
   const body = await isValidBodyHandler(event, zodInsertNumberIntegration)

   const isAlreadyExists = await getNumberIntegration(body.exoPhone)

   if(isAlreadyExists) {
      return sendError(
         event,
         createError({
            statusCode: 400,
            statusMessage: "Exophone is already exists",
         }),
      );
   }
  
   const creation = await createNumberIntegration({
      ...body,
      organizationId
   })
   return isValidReturnType(event, creation)
})