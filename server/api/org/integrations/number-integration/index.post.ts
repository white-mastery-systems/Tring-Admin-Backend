import { createNumberIntegration } from "~/server/utils/db/number-integration"

const zodInsertNumberIntegration = z.object({
   provider: z.string(),
   exoPhone: z.number(),
   countryCode: z.string()
})

export default defineEventHandler(async (event) => {
   const organizationId = (await isOrganizationAdminHandler(event)) as string
  
   const body = await isValidBodyHandler(event, zodInsertNumberIntegration)
  
   const creation = await createNumberIntegration({
      ...body,
      organizationId
   })
   return isValidReturnType(event, creation)
})