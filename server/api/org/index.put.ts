const zodBodyValidator = z.object({
  name: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
  avgTraffic: z.string().min(1).optional(),
  employeeCount: z.string().min(1).optional(),
})

export default defineEventHandler(async (event) => {
  const orgId = event.context.user?.organizationId;

  const body = await isValidBodyHandler(event, zodBodyValidator)

  const updateOrg = {
    name: body.name,
    metadata: {
       industry: body?.industry,
       avgTraffic: body?.avgTraffic,
       employeeCount: body?.employeeCount
    }
  }

  const data = await updateOrganization(orgId, updateOrg)

  return data
})