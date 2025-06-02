const zodQueryValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  integrationName: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const query = await isValidQueryHandler(event, zodQueryValidator)

  const data = await getTtsIntegrationList(organizationId, query, timeZone)

  return data
})