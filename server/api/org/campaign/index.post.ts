const zodInsertCampaign = z.object({
  countryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  campaignDate: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
  campaignTime: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
})

export default defineEventHandler(async (event) => {
   const organizationId = (await isOrganizationAdminHandler(event)) as string;

   const body: any = await isValidBodyHandler(event, zodInsertCampaign)

   const data = await createCampaign({
    ...body,
    organizationId,
   })

   return data
})