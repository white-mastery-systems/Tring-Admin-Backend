export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = getQuery(event);
  return await listBots(organizationId, query);
});
