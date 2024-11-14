export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = await isValidQueryHandler(event, z.object({
    type: z.string()
  }))
  // console.log({ query })
  const usage = await getOrgUsage(organizationId, timeZone, query);

  return usage;
});
