export default defineEventHandler(async (event) => {
  //   const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const orgId = event.context.user?.organizationId;
  if (orgId) {
    const orgDetails: any = await getOrganizationById(orgId);
    const planDetails = await getPricingInformation(orgDetails?.planCode);
    return { orgDetails, planDetails };
  }
  return null;
});
