export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query: any = await getQuery(event);
  const integrationData: any = await findIntegrationDetails(
    organizationId,
    query.id,
  );
  const metadata = integrationData?.metadata
  const data = await $fetch(`https://cliq.zoho.in/api/v2/channels`,
    {
      method: "GET",
      headers: { 
        Authorization: `Zoho-oauthtoken ${metadata?.access_token}`
      },
    }
  )

  return data
})