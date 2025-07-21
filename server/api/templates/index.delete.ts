import {
  deleteTemplateById
} from "~/server/utils/template";

const zodQueryValidator = z.object({
  integrationId: z.string(),
  templateId: z.string(),
  templateName: z.string()
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const query: any = await isValidQueryHandler(event, zodQueryValidator);
  const integration: any = await getIntegrationById(organizationId, query?.integrationId);
  const data = await deleteTemplateById(
    integration?.metadata?.wabaId,
    integration?.metadata?.access_token,
    query?.templateId,
    query?.templateName,
  );
  return data;
});
