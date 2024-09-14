const zodQueryvalidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const query = await isValidQueryHandler(event, zodQueryvalidator)
  
  const data = await campaignList(organizationId, query)

  return data
})