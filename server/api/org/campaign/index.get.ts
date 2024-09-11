export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  
  const data = await campaignList(organizationId)

  return data
})