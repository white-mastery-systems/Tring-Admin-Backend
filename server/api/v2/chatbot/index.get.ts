
const zodQueryValidator = z.object({
  active: z.string().optional(),
  q: z.string().optional(),
  industry: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  // const query = getQuery(event);
  const query = await isValidQueryHandler(event, zodQueryValidator)

  return await listBots(organizationId, query, timeZone);
});
