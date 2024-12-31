import { getTemplatesByWabaId } from "~/server/utils/template";

const zodQueryValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";

  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const query: any = await isValidQueryHandler(event, zodQueryValidator);

  const integration: any = await getIntegrationById(organizationId, query?.q);

  const templateList = await getTemplatesByWabaId(integration?.metadata?.wabaId, integration?.metadata?.access_token, query?.limit);

  return templateList;
});
