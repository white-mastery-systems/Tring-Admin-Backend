export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = getQuery(event);
  console.log({ query });
  return await getAnalytics(organizationId, query?.period);
});
