export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const usage = await getOrgUsage(organizationId);

  return usage;
});
