export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const query = await isValidQueryHandler(event, z.object({
    integrationId: z.string(),
    templateName: z.string()
  }))

  const integration: any = await getIntegrationById(organizationId, query?.integrationId);

  const templateList = await getTemplateDetailsByName(integration.metadata?.wabaId, integration.metadata?.access_token, query.templateName)

  const templateInformation = templateList?.data?.find(
    (i: any) => i.name === query.templateName,
  );

  return templateInformation
})