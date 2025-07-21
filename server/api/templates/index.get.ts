import { getNewTemplatesByWabaId } from "~/server/utils/template";

const zodQueryValidator = z.object({
  integrationId: z.string(),
  status: z.string().default("all")
});

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";

  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const query: any = await isValidQueryHandler(event, zodQueryValidator);

  const integration: any = await getIntegrationById(organizationId, query?.integrationId);

  if(integration?.metadata?.wabaId && integration?.metadata?.access_token){
    const templateList = await getNewTemplatesByWabaId(integration?.metadata?.wabaId, integration?.metadata?.access_token, query?.status!)
    return {
      integrationId: query?.integrationId,
      templates: templateList || [],
    };
  }

  return {
    integrationId: query?.id,
    templates: [],
  };
 
});
